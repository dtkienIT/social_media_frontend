import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  const myId = localStorage.getItem('userId');

  // 1. Lấy thông tin hiện tại để điền vào form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get(`/users/${myId}`);
        setFullName(res.data.fullName || '');
      } catch (err) {
        console.error("Không thể tải thông tin người dùng:", err);
      }
    };
    if (myId) fetchUserData();
  }, [myId]);

  // 2. Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Tạo link tạm thời để hiển thị ảnh ngay trên giao diện
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 3. Gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return; // Ngăn chặn bấm nút nhiều lần

    setUploading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    if (file) {
      // Key 'avatar' phải khớp hoàn toàn với Backend (upload.single('avatar'))
      formData.append('avatar', file); 
    }

    try {
      // Thực hiện gửi request lên Backend
      await api.put('/users/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Cập nhật thông tin thành công!");
      // Quay lại trang cá nhân sau khi lưu xong
      navigate(`/profile/${myId}`);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      const errorMessage = err.response?.data?.message || "Lỗi server khi upload ảnh";
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#1c1e21' }}>Chỉnh sửa cá nhân</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Nhập tên */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Họ và tên</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            required
          />
        </div>

        {/* Chọn ảnh */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ảnh đại diện</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'block', width: '100%' }}
          />
          
          {/* Xem trước ảnh (Preview) */}
          {preview && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1877f2' }} 
              />
              <p style={{ fontSize: '12px', color: '#65676b' }}>Ảnh mới của bạn</p>
            </div>
          )}
        </div>

        {/* Nút điều hướng */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            onClick={() => navigate(`/profile/${myId}`)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#e4e6eb', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Hủy
          </button>
          
          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              flex: 2, 
              padding: '12px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: uploading ? '#89b8f7' : '#1877f2', 
              color: '#fff', 
              fontWeight: 'bold', 
              cursor: uploading ? 'not-allowed' : 'pointer' 
            }}
          >
            {uploading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;