import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const myId = localStorage.getItem('userId');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    if (file) formData.append('avatar', file);

    try {
      await api.put('/users/update', formData);
      alert("Cập nhật thành công!");
      navigate(`/profile/${myId}`);
    } catch {
      alert("Lỗi khi cập nhật!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h3>Chỉnh sửa trang cá nhân</h3>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '15px' }}>
          <label>Tên hiển thị:</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Ảnh đại diện mới:</label>
          <input type="file" onChange={handleFileChange} style={{ display: 'block', marginTop: '5px' }} />
          {preview && <img src={preview} style={{ width: '100px', marginTop: '10px', borderRadius: '50%' }} alt="Preview" />}
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          style={{ width: '100%', padding: '10px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {uploading ? "Đang tải lên..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;