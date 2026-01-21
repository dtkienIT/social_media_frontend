import { useEffect, useState } from 'react';
import api from '../api';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts/all');
        setPosts(res.data);
      } catch (err) {
        console.error("Lỗi lấy bài viết", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Bảng tin</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ddd', marginBottom: '20px', borderRadius: '8px', padding: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={post.User?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
            <strong>{post.User?.fullName}</strong>
          </div>
          <p>{post.content}</p>
          {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px' }} />}
          <div style={{ marginTop: '10px', color: '#65676b' }}>
            ❤️ {post.likes?.length || 0} lượt thích
          </div>
        </div>
      ))}
    </div>
  );
};

export default Newsfeed;