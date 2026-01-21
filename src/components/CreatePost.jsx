import { useState } from 'react';
import api from '../api';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return alert("Vui lòng nhập nội dung!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      await api.post('/posts/create', formData);
      setContent('');
      setImage(null);
      onPostCreated(); // Gọi hàm này để Newsfeed tải lại danh sách bài mới
    } catch (err) {
      console.log(err);
      alert("Đăng bài thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="Bạn đang nghĩ gì?" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', resize: 'none' }}
          rows="3"
        />
        <hr style={{ border: '0.5px solid #eee' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" disabled={loading} style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Đang đăng...' : 'Đăng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;