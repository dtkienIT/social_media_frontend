import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sử dụng FormData để gửi file
    const formData = new FormData();
    formData.append('fullName', fullName);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      await api.put('/users/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Cập nhật thông tin thành công!");
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Chỉnh sửa cá nhân</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Họ và tên mới:</label>
          <input 
            type="text" 
            placeholder="Nhập tên mới..." 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Ảnh đại diện mới:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button 
          type="button" 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#65676b', cursor: 'pointer' }}
        >
          Hủy bỏ
        </button>
      </form>
    </div>
  );
};

export default EditProfile;