import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { BACKEND_DOMAIN } from '../api';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const myId = String(localStorage.getItem('userId') || "").trim();

  // Hàm xử lý link ảnh thông minh
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150';
    if (path.startsWith('http')) return path; // Nếu là link Cloudinary
    return `${BACKEND_DOMAIN}${path}`; // Nếu là link /uploads cũ
  };

  const fetchProfileData = useCallback(async () => {
    try {
      // 1. Lấy thông tin User
      const userRes = await api.get(`/users/${userId}`);
      setProfileUser(userRes.data);

      // 2. Lấy bài viết của User đó
      const postsRes = await api.get(`/posts/user/${userId}`);
      setUserPosts(postsRes.data);
    } catch (err) {
      console.error("Lỗi tải profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ color: '#1877f2', fontWeight: 'bold', textDecoration: 'none' }}>← Về trang chủ</Link>
      
      {/* Header Profile */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <img 
          src={getImageUrl(profileUser?.avatar)} 
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }}
          alt="Avatar"
          onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
        />
        <h2 style={{ marginTop: '15px' }}>{profileUser?.fullName || "Người dùng"}</h2>
        
        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')}
            style={{ marginTop: '10px', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #ddd', fontWeight: 'bold' }}
          >
            ⚙️ Chỉnh sửa thông tự cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết gần đây</h3>
      
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginTop: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <p>{post.content}</p>
          {post.image && (
            <img src={getImageUrl(post.image)} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} alt="Post content" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Profile;