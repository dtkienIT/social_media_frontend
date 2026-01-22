import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import CommentSection from '../components/CommentSection';

const Profile = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  
  const myId = String(localStorage.getItem('userId') || "").trim();

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Gọi API lấy thông tin Profile tổng hợp
      // Backend của bạn nên có route trả về cả thông tin User và danh sách Posts
      const res = await api.get(`/users/profile/${userId}`); 
      
      if (res.data) {
        setProfileUser(res.data.user);
        setUserPosts(res.data.posts || []);
        
        // 2. Tính tổng lượt thích từ tất cả bài viết
        const total = (res.data.posts || []).reduce((acc, post) => 
          acc + (post.likes?.length || 0), 0
        );
        setTotalLikes(total);
      }
    } catch (err) {
      console.error("Lỗi tải Profile:", err);
      // Nếu API profile riêng lẻ bị lỗi 404, thử gọi API danh sách bài viết riêng
      try {
          const userRes = await api.get(`/users/${userId}`);
          setProfileUser(userRes.data.user);
          const postsRes = await api.get(`/users/posts/${userId}`);
          setUserPosts(postsRes.data);
      } catch  {
          console.error("Cả hai phương án tải dữ liệu đều thất bại");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có muốn xóa bài viết này không?")) return;
    try {
      await api.delete(`/posts/${postId}`); // Khớp với route trong post.routes.js
      setUserPosts(prev => prev.filter(p => p.id !== postId));
      alert("Đã xóa bài viết!");
    } catch  {
      alert("Không thể xóa bài viết.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải...</div>;
  if (!profileUser) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <p>Không tìm thấy người dùng</p>
      <Link to="/">Quay lại trang chủ</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>
      
      {/* Thông tin cá nhân */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <img 
          src={profileUser.avatar || 'https://placehold.co/150'} 
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff' }}
          alt="Avatar"
        />
        <h2 style={{ marginTop: '15px' }}>{profileUser.fullName}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', color: '#65676b' }}>
          <span><strong>{userPosts.length}</strong> Bài viết</span>
          <span><strong>{totalLikes}</strong> Lượt thích ❤️</span>
        </div>

        {myId === String(userId) && (
          <button onClick={() => navigate('/edit-profile')} style={{ marginTop: '15px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold', cursor: 'pointer' }}>
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết của bạn</h3>

      {/* Danh sách bài viết */}
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '16px', marginBottom: '12px' }}>{post.content}</p>
          
          {post.image && (
            <img src={post.image} style={{ width: '100%', borderRadius: '10px', marginBottom: '12px' }} alt="Post" />
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <span style={{ color: '#65676b', fontSize: '12px' }}>
              Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>

            {myId === String(userId) && (
              <button onClick={() => handleDeletePost(post.id)} style={{ color: '#f02849', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                🗑️ Xóa bài viết
              </button>
            )}
          </div>

          {/* Phần bình luận tích hợp */}
          <CommentSection postId={post.id} currentUserId={myId} />
        </div>
      ))}
    </div>
  );
};

export default Profile;