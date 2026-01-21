import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost'; 

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);

  // Hàm lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/all');
      setPosts(res.data);
    } catch (err) {
      console.error("Lỗi lấy bài viết", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Bảng tin</h2>

      {/* CHỖ THÊM PHẦN ĐĂNG BÀI: Đặt ở trên cùng của danh sách */}
      <CreatePost onPostCreated={fetchPosts} />

      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ddd', marginBottom: '20px', borderRadius: '8px', padding: '15px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={post.User?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} />
            {/* Link dẫn tới Profile */}
            <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: '#000' }}>
              <strong>{post.User?.fullName}</strong>
            </Link>
          </div>
          <p>{post.content}</p>
          {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />}
          <div style={{ marginTop: '10px', color: '#65676b' }}>
            ❤️ {post.likes?.length || 0} lượt thích
          </div>
        </div>
      ))}
    </div>
  );
};

export default Newsfeed;