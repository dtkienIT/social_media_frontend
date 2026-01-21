import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Lấy thông tin từ localStorage
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  // 1. Hàm lấy danh sách bài viết
  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts/all');
      // Sắp xếp bài mới nhất lên đầu
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

  // 2. Logic Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // 3. Xử lý Like/Unlike (Optimistic UI)
  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập để Like bài viết!");

    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Lỗi khi like:", err);
    }
  };

  // 4. Xử lý Xóa bài viết
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch  {
        alert("Xóa thất bại!");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải bảng tin...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* --- THANH ĐIỀU HƯỚNG (NAVBAR) --- */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '20px', background: '#fff', padding: '10px 20px', 
        borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold', fontSize: '20px' }}>
          SocialApp
        </Link>
        <div>
          {!token ? (
            <>
              <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>Đăng nhập</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#42b72a', fontWeight: 'bold' }}>Đăng ký</Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to={`/profile/${currentUserId}`} style={{ textDecoration: 'none', color: '#050505', fontSize: '14px' }}>Trang cá nhân</Link>
              <button onClick={handleLogout} style={{ background: '#fa3e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- PHẦN ĐĂNG BÀI --- */}
      {token ? (
        <CreatePost onPostCreated={fetchPosts} />
      ) : (
        <div style={{ textAlign: 'center', padding: '15px', background: '#e4e6eb', borderRadius: '8px', marginBottom: '20px' }}>
          Vui lòng <strong>Đăng nhập</strong> để chia sẻ cảm nghĩ của bạn.
        </div>
      )}

      {/* --- DANH SÁCH BÀI VIẾT --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#65676b' }}>Chưa có bài viết nào.</p>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.includes(currentUserId);
            const isOwner = post.userId === currentUserId;

            return (
              <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'relative' }}>
                
                {/* Nút Xóa (Chỉ hiện cho chủ bài đăng) */}
                {isOwner && (
                  <button 
                    onClick={() => handleDelete(post.id)}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    🗑️
                  </button>
                )}

                {/* Header: Avatar + Tên */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <img 
                    src={post.User?.avatar || 'https://via.placeholder.com/40'} 
                    alt="avatar" 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} 
                  />
                  <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: '#050505', fontWeight: 'bold' }}>
                    {post.User?.fullName}
                  </Link>
                </div>

                {/* Nội dung */}
                <p style={{ fontSize: '15px', whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{post.content}</p>
                {post.image && <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />}

                {/* Nút Like */}
                <div style={{ borderTop: '1px solid #ebedf0', paddingTop: '10px' }}>
                  <button 
                    onClick={() => handleLike(post.id)}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', gap: '8px',
                      color: isLiked ? '#e0245e' : '#65676b', fontWeight: isLiked ? 'bold' : 'normal'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{isLiked ? '❤️' : '🤍'}</span>
                    <span>{post.likes?.length || 0} lượt thích</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Newsfeed;