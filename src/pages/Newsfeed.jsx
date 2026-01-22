import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ localStorage
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  // 1. Hàm lấy danh sách bài viết (Sắp xếp mới nhất lên đầu)
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

  // 2. Logic Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // 3. Xử lý Like bài viết (Cập nhật giao diện ngay lập tức)
  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập để Like!");
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Lỗi Like:", err);
    }
  };

  // 4. Xử lý Xóa bài viết (CHỖ BẠN ĐANG THIẾU)
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await api.delete(`/posts/${postId}`);
        // Xóa bài viết khỏi giao diện ngay lập tức
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch  {
        alert("Xóa thất bại! Bạn có thể không phải là chủ bài đăng.");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* NAVBAR: Login, Register, Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1877f2', margin: 0 }}>SocialApp</h3>
        <div>
          {!token ? (
            <>
              <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>Đăng nhập</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#42b72a', fontWeight: 'bold' }}>Đăng ký</Link>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link to={`/profile/${currentUserId}`} style={{ textDecoration: 'none', color: '#050505' }}>Cá nhân</Link>
              <button onClick={handleLogout} style={{ background: '#fa3e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>

      {/* CREATE POST: Chỉ hiện khi đã đăng nhập */}
      {token ? <CreatePost onPostCreated={fetchPosts} /> : <p style={{ textAlign: 'center' }}>Đăng nhập để đăng bài.</p>}

      {/* FEED: Danh sách bài viết */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map((post) => {
          const isLiked = post.likes?.includes(currentUserId);
          // Kiểm tra xem ID người dùng hiện tại có khớp với người đăng bài không
          const isOwner = String(post.userId) === String(currentUserId);

          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'relative' }}>
              
              {/* NÚT XÓA: Chỉ hiện cho chủ bài đăng */}
              {isOwner && (
                <button 
                  onClick={() => handleDelete(post.id)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                  🗑️
                </button>
              )}

              {/* Header: Người đăng */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={post.User?.avatar || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} alt="avatar" />
                <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: '#050505', fontWeight: 'bold' }}>
                  {post.User?.fullName}
                </Link>
              </div>

              {/* Nội dung bài đăng */}
              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
              {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} alt="post" />}

              {/* Tương tác Like */}
              <div style={{ borderTop: '1px solid #ebedf0', marginTop: '12px', paddingTop: '10px' }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#e0245e' : '#65676b', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <span style={{ fontSize: '20px' }}>{isLiked ? '❤️' : '🤍'}</span>
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