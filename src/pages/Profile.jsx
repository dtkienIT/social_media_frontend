import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { userId } = useParams(); // ID của trang đang xem từ URL
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ID của chính bạn (người đang đăng nhập)
  const myId = String(localStorage.getItem('userId') || "");

  const fetchUserPosts = useCallback(async () => {
    try {
      const res = await api.get(`/posts/all`);
      // Lọc bài viết: Chỉ lấy những bài có userId trùng với ID trên URL
      const filtered = res.data.filter(p => String(p.userId) === String(userId));
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch  {
      console.error("Lỗi tải bài viết");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // HÀM XÓA BÀI VIẾT
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await api.delete(`/posts/${postId}`);
        // Cập nhật danh sách ngay lập tức
        setUserPosts(prev => prev.filter(post => post.id !== postId));
        alert("Đã xóa bài viết thành công!");
      } catch  {
        alert("Lỗi khi xóa bài viết! Bạn có thể không có quyền.");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* THÔNG TIN ĐẦU TRANG */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Trang cá nhân</h2>
        <p style={{ color: '#65676b', fontSize: '13px' }}>ID: {userId}</p>
        
        {/* Thông báo nếu đây là trang của chính mình */}
        {myId === String(userId) && (
          <span style={{ background: '#e7f3ff', color: '#1877f2', padding: '4px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Đây là trang của bạn
          </span>
        )}
      </div>

      <h3 style={{ marginBottom: '15px' }}>Bài viết của bạn</h3>

      {/* DANH SÁCH BÀI VIẾT TRÊN PROFILE */}
      {userPosts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#65676b' }}>Chưa có bài viết nào.</p>
      ) : (
        userPosts.map(post => (
          <div key={post.id} style={{ 
            background: '#fff', padding: '15px', borderRadius: '8px', 
            marginBottom: '15px', position: 'relative', border: '1px solid #ddd' 
          }}>
            
            {/* NÚT XÓA: Ép kiểu String cho cả 2 bên để đảm bảo luôn hiện khi khớp ID */}
            {myId === String(userId) && (
              <button 
                onClick={() => handleDelete(post.id)}
                style={{ 
                  position: 'absolute', top: '15px', right: '15px', 
                  background: '#ff4d4f', color: '#fff', border: 'none', 
                  borderRadius: '6px', padding: '6px 12px', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                XÓA BÀI
              </button>
            )}

            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>{post.User?.fullName}</div>
            <p style={{ whiteSpace: 'pre-wrap', color: '#050505' }}>{post.content}</p>
            
            {post.image && (
              <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />
            )}
            
            <div style={{ marginTop: '12px', color: '#65676b', fontSize: '12px' }}>
              Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;