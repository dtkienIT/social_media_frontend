import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null); // Lưu thông tin người dùng đang xem
  const [loading, setLoading] = useState(true);
  
  const myId = String(localStorage.getItem('userId') || "").trim();

  const fetchProfileData = useCallback(async () => {
    if (!userId || userId === "null") return setLoading(false);
    try {
      // 1. Lấy tất cả bài viết và lọc theo userId
      const postsRes = await api.get(`/posts/all`);
      const filtered = postsRes.data.filter(p => String(p.userId).trim() === String(userId).trim());
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      // 2. Tìm thông tin User từ bài viết đầu tiên hoặc một API lấy user chi tiết (nếu có)
      // Ở đây ta tận dụng dữ liệu User đi kèm trong bài viết
      if (filtered.length > 0) {
        setProfileUser(filtered[0].User);
      }
    } catch  {
      console.error("Lỗi tải dữ liệu profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setUserPosts(prev => prev.filter(post => post.id !== postId));
      } catch { alert("Lỗi xóa bài!"); }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', marginBottom: '20px', display: 'inline-block' }}>← Quay lại Bảng tin</Link>
      
      {/* --- PHẦN ĐẦU TRANG CÁ NHÂN (CHỈ HIỆN 1 LẦN) --- */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <img 
          src={profileUser?.avatar ? `https://social-media-jev1.onrender.com${profileUser.avatar}` : 'https://via.placeholder.com/100'} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px', border: '4px solid #f0f2f5', objectFit: 'cover' }} 
          alt="avatar" 
        />
        
        {/* HIỂN THỊ TÊN THAY VÌ ID */}
        <h2 style={{ margin: '0 0 10px 0' }}>{profileUser?.fullName || "Người dùng"}</h2>
        
        {/* NÚT CHỈNH SỬA DUY NHẤT Ở ĐÂY */}
        {myId === String(userId).trim() && (
          <div style={{ marginTop: '15px' }}>
            <span style={{ display: 'block', color: '#42b72a', fontWeight: 'bold', marginBottom: '10px' }}>Đây là bạn</span>
            <button 
              onClick={() => navigate('/edit-profile')}
              style={{ padding: '8px 20px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', background: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}
            >
              ⚙️ Chỉnh sửa thông tin
            </button>
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: '15px' }}>Bài viết của bạn</h3>

      {/* --- DANH SÁCH BÀI VIẾT --- */}
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          
          {myId === String(userId).trim() && (
            <button 
              onClick={() => handleDelete(post.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              XÓA BÀI
            </button>
          )}

          <p style={{ marginTop: '10px', fontSize: '15px' }}>{post.content}</p>
          {post.image && <img src={post.image} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} alt="" />}
        </div>
      ))}
      
      {userPosts.length === 0 && <p style={{ textAlign: 'center', color: '#65676b' }}>Chưa có bài viết nào.</p>}
    </div>
  );
};

export default Profile;