import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy ID người dùng hiện tại từ localStorage
  const currentUserId = localStorage.getItem('userId');

  // 1. Hàm lấy danh sách bài viết (Dùng useCallback để tránh lỗi render vô tận)
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

  // 2. Gọi API lần đầu khi load trang
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. Xử lý Like/Unlike (Optimistic UI)
  const handleLike = async (postId) => {
    if (!currentUserId) return alert("Vui lòng đăng nhập!");

    try {
      const res = await api.put(`/posts/${postId}/like`);
      // Cập nhật state ngay lập tức dựa trên dữ liệu trả về từ server
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Lỗi khi like bài viết:", err);
    }
  };

  // 4. Xử lý Xóa bài viết
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này không?")) {
      try {
        await api.delete(`/posts/${postId}`);
        // Lọc bỏ bài viết khỏi danh sách hiển thị
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch  {
        alert("Xóa thất bại! Vui lòng thử lại.");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải bảng tin...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#1877f2', marginBottom: '20px' }}>Bảng tin</h2>

      {/* Phần đăng bài viết mới */}
      <CreatePost onPostCreated={fetchPosts} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#65676b' }}>Chưa có bài viết nào.</p>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.includes(currentUserId);
            const isOwner = post.userId === currentUserId;

            return (
              <div key={post.id} style={{ 
                background: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)', 
                padding: '15px',
                position: 'relative'
              }}>
                {/* Nút Xóa (Chỉ hiện nếu là chủ bài đăng) */}
                {isOwner && (
                  <button 
                    onClick={() => handleDelete(post.id)}
                    style={{ 
                      position: 'absolute', top: '15px', right: '15px',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' 
                    }}
                    title="Xóa bài viết"
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
                  <Link 
                    to={`/profile/${post.userId}`} 
                    style={{ textDecoration: 'none', color: '#050505', fontWeight: 'bold' }}
                  >
                    {post.User?.fullName || 'Người dùng'}
                  </Link>
                </div>

                {/* Body: Nội dung text + Hình ảnh */}
                <p style={{ fontSize: '15px', color: '#050505', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                  {post.content}
                </p>
                
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="post" 
                    style={{ width: '100%', borderRadius: '4px', display: 'block', marginBottom: '10px' }} 
                  />
                )}

                {/* Footer: Nút Like tương tác */}
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #ebedf0' }}>
                  <button 
                    onClick={() => handleLike(post.id)}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', gap: '8px',
                      color: isLiked ? '#e0245e' : '#65676b',
                      fontWeight: isLiked ? 'bold' : 'normal',
                      transition: 'transform 0.1s ease'
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