import { useState } from 'react';
import api from '../api';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      await api.post('/posts/create', formData);
      setContent('');
      setImage(null);
      alert("Đăng bài thành công!");
      onPostCreated(); // Tải lại danh sách bài viết
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể đăng bài"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="Bạn đang nghĩ gì?" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', resize: 'none' }}
          rows="3"
        />
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" disabled={loading} style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold' }}>
            {loading ? 'Đang đăng...' : 'Đăng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;