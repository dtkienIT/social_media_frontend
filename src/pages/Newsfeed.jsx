import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  // Ép kiểu về String để so sánh chính xác
  const currentUserId = String(localStorage.getItem('userId'));

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts/all');
      const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Lỗi khi tải bảng tin:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập!");
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) { console.error(err); }
  };

  // HÀM XỬ LÝ XÓA
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch  {
        alert("Không thể xóa bài viết này!");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1877f2', margin: 0 }}>SocialApp</h3>
        <div>
          {!token ? (
            <>
              <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>Đăng nhập</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#42b72a', fontWeight: 'bold' }}>Đăng ký</Link>
            </>
          ) : (
            <button onClick={handleLogout} style={{ background: '#fa3e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>Đăng xuất</button>
          )}
        </div>
      </div>

      {token && <CreatePost onPostCreated={fetchPosts} />}

      {/* DANH SÁCH BÀI VIẾT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map((post) => {
          // KIỂM TRA QUYỀN XÓA (Rất quan trọng)
          const isOwner = String(post.userId) === currentUserId;
          const isLiked = post.likes?.includes(currentUserId);

          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'relative' }}>
              
              {/* NÚT XÓA: Chỉ hiện nếu isOwner là true */}
              {isOwner && (
                <button 
                  onClick={() => handleDelete(post.id)}
                  style={{ 
                    position: 'absolute', top: '15px', right: '15px', 
                    background: '#f2f2f2', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  🗑️
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={post.User?.avatar || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} alt="" />
                <strong>{post.User?.fullName}</strong>
              </div>

              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
              {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px' }} alt="" />}

              <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#e0245e' : '#65676b' }}>
                  {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0} Like
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Newsfeed;