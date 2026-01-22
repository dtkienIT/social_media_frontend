import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams(); // ID từ URL
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ID của người đang đăng nhập (ép kiểu về String để an toàn)
  const currentLoggedId = String(localStorage.getItem('userId'));

  const fetchUserPosts = useCallback(async () => {
    try {
      const res = await api.get(`/posts/all`);
      // Lọc các bài viết có userId trùng với trang đang xem
      const filtered = res.data.filter(p => String(p.userId) === String(userId));
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch  {
      console.error("Lỗi tải bài viết cá nhân");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setUserPosts(prev => prev.filter(post => post.id !== postId));
        alert("Đã xóa bài viết!");
      } catch  {
        alert("Lỗi khi xóa bài viết!");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải trang cá nhân...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
        <h2>Trang cá nhân</h2>
        <p>ID người dùng: {userId}</p>
      </div>

      <h3>Bài viết của bạn</h3>
      {userPosts.length === 0 ? <p>Chưa có bài viết nào.</p> : (
        userPosts.map(post => (
          <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', position: 'relative', border: '1px solid #ddd' }}>
            
            {/* NÚT XÓA: Chỉ hiện nếu người đang đăng nhập trùng với chủ trang cá nhân */}
            {currentLoggedId === String(userId) && (
              <button 
                onClick={() => handleDelete(post.id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
              >
                Xóa bài
              </button>
            )}

            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
            {post.image && <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '8px' }} />}
            <div style={{ marginTop: '10px', color: '#65676b', fontSize: '13px' }}>
              Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;