import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const myId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const res = await api.get(`/users/${myId}`);
        const userData = res.data.user || res.data;
        setFullName(userData.fullName || '');
      } catch (err) { console.error(err); }
    };
    fetchOldData();
  }, [myId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    if (file) formData.append('avatar', file);

    try {
      // Đã xóa "const res =" để hết lỗi image_8fd351.png
      await api.put('/users/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Cập nhật thành công!");
      navigate(`/profile/${myId}`);
    } catch  {
      toast.error("Lỗi cập nhật!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3>Chỉnh sửa trang cá nhân</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" value={fullName} onChange={e => setFullName(e.target.value)} 
          placeholder="Tên mới" style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />
        <input type="file" onChange={e => {
          setFile(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }} />
        {preview && <img src={preview} style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }} alt="preview" />}
        <button 
          type="submit" disabled={uploading}
          style={{ width: '100%', padding: '10px', marginTop: '20px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {uploading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;