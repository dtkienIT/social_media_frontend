import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Lấy dữ liệu xác thực từ localStorage
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  // 1. ĐỊNH NGHĨA HÀM FETCH TRƯỚC (Để tránh lỗi image_c5dd2d.png)
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

  // 2. GỌI EFFECT (Dùng mảng phụ thuộc fetchPosts đã được memoize)
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. LOGIC ĐĂNG XUẤT
  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch token và userId
    navigate('/login');
  };

  // 4. LOGIC LIKE (Optimistic UI)
  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập để Like!");
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: res.data.likes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải bảng tin...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* --- NAVBAR --- */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '20px', background: '#fff', padding: '10px 20px', 
        borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold', fontSize: '20px' }}>
          SocialApp
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!token ? (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>Đăng nhập</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#42b72a', fontWeight: 'bold' }}>Đăng ký</Link>
            </>
          ) : (
            <>
              {/* Nút vào trang cá nhân để xem nút Xóa */}
              <Link 
                to={`/profile/${currentUserId}`} 
                style={{ textDecoration: 'none', color: '#050505', fontSize: '14px', fontWeight: '500' }}
              >
                Trang cá nhân
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ background: '#fa3e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- FORM ĐĂNG BÀI --- */}
      {token ? (
        <CreatePost onPostCreated={fetchPosts} />
      ) : (
        <div style={{ textAlign: 'center', padding: '15px', background: '#e4e6eb', borderRadius: '8px', marginBottom: '20px' }}>
          Chào mừng! Hãy <strong>Đăng nhập</strong> để chia sẻ cảm nghĩ của bạn.
        </div>
      )}

      {/* --- DANH SÁCH BÀI VIẾT --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map((post) => {
          const isLiked = post.likes?.includes(String(currentUserId));

          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              
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

              {/* Tương tác Like */}
              <div style={{ borderTop: '1px solid #ebedf0', paddingTop: '10px' }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: isLiked ? '#e0245e' : '#65676b', fontWeight: isLiked ? 'bold' : 'normal'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{isLiked ? '❤️' : '🤍'}</span>
                  <span>{post.likes?.length || 0} lượt thích</span>
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