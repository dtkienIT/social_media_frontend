import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams(); 
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const myId = String(localStorage.getItem('userId') || "").trim();

  const fetchUserPosts = useCallback(async () => {
    if (!userId || userId === "null") return setLoading(false);
    try {
      const res = await api.get(`/posts/all`);
      // Lọc bài viết của người dùng này
      const filtered = res.data.filter(p => String(p.userId).trim() === String(userId).trim());
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      console.error("Lỗi tải bài viết");
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
      } catch {
        alert("Lỗi: Không thể xóa bài viết!");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;
  if (!userId || userId === "null") return <div style={{ textAlign: 'center', marginTop: '50px' }}>Không tìm thấy người dùng. Hãy đăng nhập lại.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', marginBottom: '20px', display: 'block' }}>← Quay lại Bảng tin</Link>
      
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <h2>Trang cá nhân</h2>
        <p style={{ fontSize: '12px', color: '#999' }}>ID: {userId}</p>
        {myId === String(userId).trim() && <b style={{ color: '#42b72a' }}>Đây là bạn</b>}
      </div>

      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          
          {/* NÚT XÓA MÀU ĐỎ - Chỉ hiện trên trang của mình */}
          {myId === String(userId).trim() && (
            <button 
              onClick={() => handleDelete(post.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              XÓA BÀI
            </button>
          )}

          <p style={{ marginTop: '10px' }}>{post.content}</p>
          {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px' }} alt="" />}
        </div>
      ))}
    </div>
  );
};

export default Profile;