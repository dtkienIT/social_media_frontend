import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get(`/posts/user/${userId}`);
        setPosts(res.data);
        if (res.data.length > 0) setUser(res.data[0].User);
      } catch (err) {
        console.error("Lỗi tải profile", err);
      }
    };
    fetchProfileData();
  }, [userId]);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      {/* Header Profile */}
      <div style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
        <img src={user?.avatar} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #1877f2' }} />
        <h2>{user?.fullName}</h2>
        <p style={{ color: '#65676b' }}>{posts.length} bài viết</p>
      </div>

      {/* Danh sách bài viết cá nhân */}
      <h3>Bài viết của tôi</h3>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px', background: '#fff' }}>
          <p>{post.content}</p>
          {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px' }} />}
        </div>
      ))}
    </div>
  );
};

export default Profile;