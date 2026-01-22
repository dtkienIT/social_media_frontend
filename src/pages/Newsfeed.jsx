import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy thông tin xác thực từ localStorage
  const token = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('userId');
  
  // Đảm bảo currentUserId luôn là String để so sánh chính xác với mảng likes
  const currentUserId = (storedUserId && storedUserId !== "null") ? String(storedUserId) : null;

  // Hàm lấy danh sách bài viết từ Backend
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts/all');
      
      // Sắp xếp bài viết mới nhất lên đầu
      const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Lỗi tải bài viết:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Hàm xử lý Like/Dislike khớp với logic Backend mới của bạn
  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập để thả tim!");
    
    try {
      // Gọi API PUT /api/posts/:id/like
      const res = await api.put(`/posts/${postId}/like`);
      
      // Cập nhật lại mảng likes cho bài viết cụ thể trong state
      // Backend trả về: { message: "...", likes: [...] }
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Lỗi khi Like bài viết:", err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>🚀 Đang tải bảng tin...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Thanh Header điều hướng */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '20px', background: '#fff', padding: '10px 20px', 
        borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        position: 'sticky', top: '10px', zIndex: 100
      }}>
        <h3 style={{ color: '#1877f2', margin: 0, fontSize: '24px' }}>SocialApp</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {!token ? (
            <Link to="/login" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>Đăng nhập</Link>
          ) : (
            <>
              {currentUserId && (
                <Link to={`/profile/${currentUserId}`} style={{ textDecoration: 'none', color: '#65676b', fontWeight: 'bold' }}>
                  Trang cá nhân
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                style={{ background: '#fa3e3e', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ô đăng bài viết mới */}
      {token && <CreatePost onPostCreated={fetchPosts} />}

      {/* Danh sách bài viết */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {posts.map((post) => {
          // Kiểm tra xem user hiện tại đã like bài này chưa
          // Phải ép kiểu String để so sánh chính xác với mảng ID trong Backend
          const isLiked = post.likes?.map(String).includes(currentUserId);

          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              
              {/* Thông tin người đăng */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <img 
                  src={post.User?.avatar || 'https://placehold.co/40'} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} 
                  alt="avatar" 
                />
                <div>
                  <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: '#050505', fontWeight: 'bold', fontSize: '15px' }}>
                    {post.User?.fullName || "Người dùng"}
                  </Link>
                  <div style={{ color: '#65676b', fontSize: '12px' }}>
                    {new Date(post.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Nội dung chữ */}
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '15px', color: '#050505', marginBottom: '10px' }}>
                {post.content}
              </p>

              {/* Hình ảnh bài viết (nếu có) */}
              {post.image && (
                <img 
                  src={post.image} 
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', maxHeight: '500px', objectFit: 'cover' }} 
                  alt="Post content" 
                />
              )}

              {/* Nút tương tác Like/Dislike */}
              <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <button 
                  onClick={() => handleLike(post.id)} 
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', gap: '5px',
                    color: isLiked ? '#e0245e' : '#65676b',
                    fontSize: '15px', fontWeight: '600',
                    padding: '5px 10px', borderRadius: '5px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '18px' }}>{isLiked ? '❤️' : '🤍'}</span>
                  {post.likes?.length || 0} Thích
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {posts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: '#65676b', marginTop: '50px' }}>
          Chưa có bài viết nào để hiển thị.
        </div>
      )}
    </div>
  );
};

export default Newsfeed;