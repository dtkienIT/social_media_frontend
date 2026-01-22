import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import CommentSection from '../components/CommentSection';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0); // Tính năng mới

  const myId = String(localStorage.getItem('userId') || "").trim();

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Lấy thông tin User - Giữ nguyên logic cũ để tránh lỗi 404
      const userRes = await api.get(`/users/${userId}`);
      setProfileUser(userRes.data.user);

      // 2. Lấy danh sách bài viết - Giữ nguyên logic cũ
      const postsRes = await api.get(`/users/posts/${userId}`);
      const posts = postsRes.data;
      setUserPosts(posts);

      // 3. TÍNH TỔNG LIKE: Chức năng mới bạn yêu cầu
      const total = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
      setTotalLikes(total);

    } catch (err) {
      console.error("Lỗi tải Profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Logic xóa bài viết - Giữ nguyên 100% từ code cũ của bạn
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có muốn xóa bài viết này không?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      alert("Đã xóa bài viết thành công!");
      
      setUserPosts(prevPosts => {
        const newPosts = prevPosts.filter(p => p.id !== postId);
        // Cập nhật lại tổng like sau khi xóa
        const newTotal = newPosts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
        setTotalLikes(newTotal);
        return newPosts;
      });
    } catch (err) {
      console.error("Lỗi xóa bài viết:", err);
      alert(err.response?.data?.message || "Không thể xóa bài viết này.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải...</div>;
  if (!profileUser) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Không tìm thấy người dùng.</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>
      
      {/* Header Profile - Giữ UI cũ và thêm Thống kê Like */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <img 
          src={profileUser.avatar || 'https://placehold.co/150'} 
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }}
          alt="Avatar"
        />
        <h2 style={{ marginTop: '15px' }}>{profileUser.fullName}</h2>
        
        {/* HIỂN THỊ TỔNG LIKE: Phần bạn muốn thêm */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', color: '#65676b' }}>
          <span><strong>{userPosts.length}</strong> Bài viết</span>
          <span><strong>{totalLikes}</strong> Lượt thích nhận được ❤️</span>
        </div>

        {myId === String(userId) && (
          <button onClick={() => navigate('/edit-profile')} style={{ marginTop: '15px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold', cursor: 'pointer' }}>
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết của bạn</h3>

      {/* Danh sách bài viết - Kết hợp UI cũ và CommentSection mới */}
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>{post.content}</p>
          
          {post.image && (
            <img src={post.image} style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} alt="Post" />
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <span style={{ color: '#65676b', fontSize: '12px' }}>
              👍 {post.likes?.length || 0} lượt thích · Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>

            {myId === String(userId) && (
              <button 
                onClick={() => handleDeletePost(post.id)}
                style={{ color: '#f02849', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                🗑️ Xóa bài viết
              </button>
            )}
          </div>

          {/* CHỨC NĂNG MỚI: Xem/Thêm comment ngay tại Profile */}
          <div style={{ marginTop: '10px' }}>
            <CommentSection postId={post.id} currentUserId={myId} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;