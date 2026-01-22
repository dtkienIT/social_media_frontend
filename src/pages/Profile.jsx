import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null); // Lưu thông tin người dùng (tên, ảnh)
  const [loading, setLoading] = useState(true);
  
  const myId = String(localStorage.getItem('userId') || "").trim();
  const BACKEND_URL = "https://social-media-jev1.onrender.com";

  const fetchProfileData = useCallback(async () => {
    if (!userId || userId === "null") return setLoading(false);
    try {
      // Lấy tất cả bài viết
      const res = await api.get(`/posts/all`);
      
      // Lọc bài viết của người dùng đang xem
      const filtered = res.data.filter(p => String(p.userId).trim() === String(userId).trim());
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      // Lấy thông tin User từ bài viết đầu tiên để hiển thị Header
      if (filtered.length > 0) {
        setProfileUser(filtered[0].User);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setUserPosts(prev => prev.filter(post => post.id !== postId));
      } catch  {
        alert("Lỗi: Không thể xóa bài viết!");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', marginBottom: '20px', display: 'inline-block', fontWeight: 'bold' }}>
        ← Quay lại Bảng tin
      </Link>
      
      {/* --- PHẦN ĐẦU TRANG CÁ NHÂN (HEADER) --- */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
            src={profileUser?.avatar ? `${BACKEND_URL}${profileUser.avatar}` : 'https://via.placeholder.com/100'} 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }} 
            alt="avatar"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
          />
        </div>
        
        {/* Hiển thị Tên thay vì ID */}
        <h2 style={{ margin: '15px 0 5px 0', color: '#050505' }}>
          {profileUser?.fullName || "Người dùng"}
        </h2>
        
        {/* Nút Chỉnh sửa duy nhất ở đầu trang */}
        {myId === String(userId).trim() && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: '#42b72a', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>Đây là bạn</p>
            <button 
              onClick={() => navigate('/edit-profile')}
              style={{ 
                padding: '8px 20px', 
                borderRadius: '6px', 
                border: '1px solid #ddd', 
                cursor: 'pointer', 
                background: '#f2f3f5', 
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ⚙️ Chỉnh sửa thông tin
            </button>
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: '15px', color: '#65676b' }}>Bài viết của bạn</h3>

      {/* --- DANH SÁCH BÀI VIẾT --- */}
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          
          {/* Nút Xóa bài viết */}
          {myId === String(userId).trim() && (
            <button 
              onClick={() => handleDelete(post.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              XÓA BÀI
            </button>
          )}

          <p style={{ marginTop: '10px', fontSize: '16px', lineHeight: '1.5' }}>{post.content}</p>
          
          {post.image && (
            <img 
              src={post.image} 
              style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} 
              alt="post" 
            />
          )}
          
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#65676b' }}>
            Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      ))}

      {userPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px', color: '#65676b' }}>
          Chưa có bài viết nào để hiển thị.
        </div>
      )}
    </div>
  );
};

export default Profile;