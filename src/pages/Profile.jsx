import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Đảm bảo baseURL trong api.js là .../api

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ID người dùng đang đăng nhập
  const myId = String(localStorage.getItem('userId') || "").trim();

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Lấy thông tin User (Khớp route router.get('/:userId'))
      const userRes = await api.get(`/users/${userId}`);
      // Dựa trên image_8ef9d2.png, data nằm trong userRes.data.user
      setProfileUser(userRes.data.user);

      // 2. Lấy bài viết (SỬA LẠI ĐƯỜNG DẪN Ở ĐÂY)
      // Khớp với URL Postman thành công: /api/users/posts/:userId
      const postsRes = await api.get(`/users/posts/${userId}`);
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
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>
      
      {/* Thông tin cá nhân */}
      <div style={{ 
        background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', 
        marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <img 
          src={profileUser.avatar || 'https://placehold.co/150'} 
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }}
          alt="Avatar"
          onError={(e) => { e.target.src = 'https://placehold.co/150'; }}
        />
        <h1 style={{ marginTop: '15px' }}>{profileUser.fullName}</h1>
        
        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')}
            style={{ 
              marginTop: '10px', padding: '10px 20px', borderRadius: '8px', 
              cursor: 'pointer', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold' 
            }}
          >
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '40px', color: '#65676b' }}>Bài viết của bạn</h3>

      {userPosts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Chưa có bài viết nào.</p>
      ) : (
        userPosts.map(post => (
          <div key={post.id} style={{ 
            background: '#fff', padding: '20px', borderRadius: '10px', 
            marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <p style={{ fontSize: '16px' }}>{post.content}</p>
            
            {/* Hiển thị ảnh bài viết từ Cloudinary */}
            {post.image && (
              <img 
                src={post.image} 
                style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }} 
                alt="Post" 
              />
            )}
            
            <div style={{ marginTop: '15px', color: '#65676b', fontSize: '13px' }}>
              Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;