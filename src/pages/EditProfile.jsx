import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    if (image) formData.append('avatar', image);

    try {
      await api.put(`/users/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Cập nhật thành công!");
      navigate(`/profile/${userId}`);
    } catch  {
      alert("Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Chỉnh sửa trang cá nhân</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>Họ và tên mới:</label>
        <input 
          type="text" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          placeholder="Nhập tên mới..."
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          required
        />
        
        <label>Ảnh đại diện:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])} 
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;