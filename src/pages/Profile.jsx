import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const myId = String(localStorage.getItem('userId') || "").trim();
  const BACKEND_URL = "https://social-media-jev1.onrender.com";

  const fetchProfileData = useCallback(async () => {
    try {
      const res = await api.get(`/posts/all`);
      const filtered = res.data.filter(p => String(p.userId) === String(userId));
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Lấy thông tin User từ bài viết đầu tiên để hiển thị Tên và Avatar
      if (filtered.length > 0) setProfileUser(filtered[0].User);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', marginBottom: '20px', display: 'inline-block' }}>← Quay lại Bảng tin</Link>
      
      {/* PHẦN ĐẦU TRANG: CHỈ HIỆN 1 LẦN */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <img 
          src={profileUser?.avatar ? `${BACKEND_URL}${profileUser.avatar}` : 'https://via.placeholder.com/100'} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1877f2' }}
          alt="Avatar"
          onError={(e) => e.target.src = 'https://via.placeholder.com/100'} // Ảnh thay thế nếu link lỗi
        />
        
        {/* HIỂN THỊ TÊN NGƯỜI DÙNG THAY VÌ ID */}
        <h2 style={{ margin: '10px 0' }}>{profileUser?.fullName || "Người dùng"}</h2>
        
        {/* CHỈ HIỆN NÚT CHỈNH SỬA NẾU LÀ TRANG CỦA MÌNH */}
        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')}
            style={{ padding: '8px 20px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', background: '#fff', fontWeight: 'bold' }}
          >
            ⚙️ Chỉnh sửa thông tin
          </button>
        )}
      </div>

      <h3 style={{ marginBottom: '15px' }}>Bài viết của bạn</h3>
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '15px' }}>{post.content}</p>
          {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} alt="" />}
        </div>
      ))}
    </div>
  );
};

export default Profile;