import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { BACKEND_DOMAIN } from '../api';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy ID của chính mình từ localStorage để kiểm tra quyền sửa
  const myId = String(localStorage.getItem('userId') || "").trim();

  // Hàm xử lý hiển thị ảnh thông minh
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150';
    // Nếu path đã là link tuyệt đối (Cloudinary https://...) thì dùng luôn
    if (path.startsWith('http')) return path; 
    // Nếu là link tương đối cũ (/uploads/...) thì nối với domain backend
    return `${BACKEND_DOMAIN}${path}`;
  };

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Lấy thông tin chi tiết người dùng
      const userRes = await api.get(`/users/${userId}`);
      setProfileUser(userRes.data);

      // 2. Lấy danh sách bài viết của người dùng này
      const postsRes = await api.get(`/posts/user/${userId}`);
      setUserPosts(postsRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Hiển thị màn hình chờ khi đang tải dữ liệu
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#65676b' }}>
        Tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>
        ← Quay lại Bảng tin
      </Link>
      
      {/* PHẦN HEADER CÁ NHÂN */}
      <div style={{ 
        background: '#fff', 
        padding: '30px', 
        borderRadius: '12px', 
        textAlign: 'center', 
        marginTop: '20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
            src={getImageUrl(profileUser?.avatar)} 
            style={{ 
              width: '130px', 
              height: '130px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '4px solid #fff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
            alt="Avatar"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
          />
        </div>
        
        <h2 style={{ marginTop: '15px', fontSize: '24px', color: '#1c1e21' }}>
          {profileUser?.fullName || "Người dùng"}
        </h2>
        
        {/* Chỉ hiện nút sửa nếu đây là trang của chính mình */}
        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')}
            style={{ 
              marginTop: '15px', 
              padding: '8px 20px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              border: 'none', 
              backgroundColor: '#e4e6eb',
              fontWeight: 'bold',
              color: '#050505'
            }}
          >
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết của bạn</h3>
      
      {userPosts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Chưa có bài viết nào.</p>
      ) : (
        userPosts.map(post => (
          <div key={post.id} style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '15px', 
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
          }}>
            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{post.content}</p>
            {post.image && (
              <img 
                src={getImageUrl(post.image)} 
                style={{ width: '100%', borderRadius: '8px', marginTop: '15px' }} 
                alt="Post" 
              />
            )}
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', color: '#65676b', fontSize: '14px' }}>
              Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;