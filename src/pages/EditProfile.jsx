import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    if (avatar) formData.append('avatar', avatar);

    try {
      await api.put('/users/update', formData);
      alert("Cập nhật thành công!");
      navigate(`/profile/${localStorage.getItem('userId')}`);
    } catch  {
      alert("Lỗi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h2>Chỉnh sửa trang cá nhân</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Họ tên mới" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <label>Ảnh đại diện:</label>
        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;