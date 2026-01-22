import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Đảm bảo api.js có baseURL là .../api

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy ID của chính mình để hiện nút chỉnh sửa
  const myId = String(localStorage.getItem('userId') || "").trim();

  // Hàm fetch dữ liệu từ Backend đã test OK trên Postman
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Lấy thông tin User (Khớp route router.get('/:userId'))
      const userRes = await api.get(`/users/${userId}`);
      setProfileUser(userRes.data.user);

      // 2. Lấy bài viết (Khớp route router.get('/posts/:userId') bạn vừa test Postman)
      // Lưu ý: api.get sẽ tự nối thành /api/users/posts/${userId}
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

  // Màn hình chờ khi đang tải dữ liệu
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>
        🚀 Đang tải trang cá nhân...
      </div>
    );
  }

  // Nếu không tìm thấy user (Lỗi 404)
  if (!profileUser) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Không tìm thấy người dùng này</h2>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>
        ← Quay lại Bảng tin
      </Link>
      
      {/* PHẦN ĐẦU TRANG: THÔNG TIN CÁ NHÂN */}
      <div style={{ 
        background: '#fff', 
        padding: '30px', 
        borderRadius: '12px', 
        textAlign: 'center', 
        marginTop: '20px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <img 
          src={profileUser.avatar || 'https://placehold.co/150'} 
          style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            border: '4px solid #f0f2f5' 
          }}
          alt="Avatar"
          // Dự phòng nếu link Cloudinary bị lỗi
          onError={(e) => { e.target.src = 'https://placehold.co/150'; }}
        />
        <h1 style={{ marginTop: '15px', fontSize: '28px' }}>{profileUser.fullName}</h1>
        
        {/* Chỉ hiện nút chỉnh sửa nếu xem profile của chính mình */}
        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')}
            style={{ 
              marginTop: '15px', 
              padding: '10px 25px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              border: 'none', 
              backgroundColor: '#e4e6eb', 
              fontWeight: 'bold',
              fontSize: '15px'
            }}
          >
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      {/* PHẦN DANH SÁCH BÀI VIẾT */}
      <h3 style={{ marginTop: '40px', color: '#65676b', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        Bài viết của {myId === String(userId) ? "bạn" : profileUser.fullName}
      </h3>

      {userPosts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Chưa có bài viết nào được đăng.</p>
      ) : (
        userPosts.map(post => (
          <div key={post.id} style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '10px', 
            marginTop: '20px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img 
                  src={profileUser.avatar} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} 
                  alt="mini-avatar" 
                />
                <div>
                    <strong style={{ display: 'block' }}>{profileUser.fullName}</strong>
                    <small style={{ color: '#65676b' }}>{new Date(post.createdAt).toLocaleString()}</small>
                </div>
            </div>

            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{post.content}</p>
            
            {/* Hiển thị ảnh bài viết từ Cloudinary */}
            {post.image && (
              <img 
                src={post.image} 
                style={{ 
                  width: '100%', 
                  borderRadius: '10px', 
                  marginTop: '10px',
                  maxHeight: '500px',
                  objectFit: 'cover'
                }} 
                alt="Post" 
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;