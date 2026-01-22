import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { BACKEND_DOMAIN } from '../api';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const myId = String(localStorage.getItem('userId') || "").trim();

  // Hàm xử lý link ảnh: Ưu tiên link Cloudinary từ Backend trả về
  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/150';
    if (path.startsWith('http')) return path; // Trả về link Cloudinary ngay lập tức
    return `${BACKEND_DOMAIN}${path}`; // Dự phòng cho ảnh cũ
  };

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Lấy thông tin user
      const userRes = await api.get(`/users/${userId}`);
      // Dựa trên image_8f71fa.png, data nằm trong userRes.data.user
      const userData = userRes.data.user || userRes.data;
      setProfileUser(userData);

      // 2. Lấy bài viết
      const postsRes = await api.get(`/posts/user/${userId}`);
      setUserPosts(postsRes.data);
    } catch (err) {
      console.error("Lỗi tải Profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải...</div>;
  if (!profileUser) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Không tìm thấy người dùng.</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>
      
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <img 
          src={getImageUrl(profileUser.avatar)} 
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }}
          alt="Avatar"
          onError={(e) => { e.target.src = 'https://placehold.co/150'; }}
        />
        <h2 style={{ marginTop: '15px' }}>{profileUser.fullName}</h2>
        
        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')}
            style={{ marginTop: '10px', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold' }}
          >
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết của bạn</h3>
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginTop: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <p>{post.content}</p>
          {post.image && <img src={getImageUrl(post.image)} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} alt="Post" />}
        </div>
      ))}
    </div>
  );
};

export default Profile;