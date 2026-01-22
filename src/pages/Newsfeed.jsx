import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  //const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('userId');
  const currentUserId = (storedUserId && storedUserId !== "null") ? String(storedUserId) : null;

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts/all');
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

  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập để thực hiện tính năng này!");

  try {
    // 1. Gọi API PUT /api/posts/:id/like (Khớp với image_7f7651.png)
    // Lưu ý: Nếu baseURL của bạn đã có /api, thì chỉ cần /posts/${postId}/like
    const res = await api.put(`/posts/${postId}/like`);

    // 2. Cập nhật state local ngay lập tức dựa trên dữ liệu Backend trả về
    // Backend của bạn thường trả về mảng likes mới hoặc object bài viết đã cập nhật
    setPosts(prevPosts => 
      prevPosts.map(post => 
        // Tìm đúng bài viết vừa nhấn Like để cập nhật số lượng tim
        post.id === postId 
          ? { ...post, likes: res.data.likes } 
          : post
      )
    );
  } catch (err) {
    console.error("Lỗi khi tương tác Like:", err);
    // Nếu lỗi 403 hoặc 401, có thể token đã hết hạn
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      handleLogout();
    }
  }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải bảng tin...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1877f2', margin: 0 }}>SocialApp</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {!token ? (
            <Link to="/login" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>Đăng nhập</Link>
          ) : (
            <>
              {currentUserId && (
                <Link to={`/profile/${currentUserId}`} style={{ textDecoration: 'none', color: '#65676b', fontWeight: 'bold' }}>Trang cá nhân</Link>
              )}
              <button onClick={handleLogout} style={{ background: '#fa3e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>Đăng xuất</button>
            </>
          )}
        </div>
      </div>

      {token && <CreatePost onPostCreated={fetchPosts} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {posts.map((post) => {
          const isLiked = post.likes?.includes(currentUserId);
          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={post.User?.avatar || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} alt="" />
                <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: '#050505', fontWeight: 'bold' }}>{post.User?.fullName}</Link>
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
              {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px' }} alt="" />}
              <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#e0245e' : '#65676b' }}>
                  {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0} Thích
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