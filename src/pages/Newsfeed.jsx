import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetchPosts được định nghĩa để có thể tái sử dụng (truyền vào CreatePost)
  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/all');
      setPosts(res.data);
    } catch (err) {
      console.error("Lỗi lấy bài viết:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect với mảng phụ thuộc rỗng [] để đảm bảo chỉ chạy 1 lần khi mount
  useEffect(() => {
    fetchPosts();
  }, []); 

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#1877f2', marginBottom: '20px' }}>Bảng tin</h2>

      {/* Component Đăng bài - Truyền fetchPosts để load lại feed sau khi đăng */}
      <CreatePost onPostCreated={fetchPosts} />

      {loading ? (
        <p style={{ textAlign: 'center' }}>Đang tải bài viết...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={{ 
                background: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)', 
                padding: '15px' 
              }}>
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
                    {post.User?.fullName || 'Người dùng ẩn danh'}
                  </Link>
                </div>

                {/* Body: Nội dung + Hình ảnh */}
                <p style={{ fontSize: '15px', color: '#050505', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                  {post.content}
                </p>
                
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="post" 
                    style={{ width: '100%', borderRadius: '4px', display: 'block' }} 
                  />
                )}

                {/* Footer: Like/Comment */}
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #ebedf0', color: '#65676b', fontSize: '14px' }}>
                  <span>❤️ {post.likes?.length || 0} lượt thích</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Newsfeed;