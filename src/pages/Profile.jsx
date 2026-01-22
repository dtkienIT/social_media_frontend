import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import CommentSection from '../components/CommentSection'; // Import component bình luận

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0); // State lưu tổng lượt thích

  const myId = String(localStorage.getItem('userId') || "").trim();

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Lấy thông tin User (đảm bảo Backend trả về data.user)
      const userRes = await api.get(`/users/${userId}`);
      setProfileUser(userRes.data.user);

      // 2. Lấy danh sách bài viết của User
      const postsRes = await api.get(`/users/posts/${userId}`);
      const posts = postsRes.data;
      setUserPosts(posts);

      // 3. Tính tổng số lượt thích từ tất cả bài viết
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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có muốn xóa bài viết này không?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      alert("Đã xóa bài viết thành công!");
      
      // Cập nhật State để xóa khỏi giao diện và tính lại tổng Like
      setUserPosts(prevPosts => {
        const newPosts = prevPosts.filter(p => p.id !== postId);
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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>
      
      {/* Header Profile */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <img 
          src={profileUser.avatar || 'https://placehold.co/150'} 
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          alt="Avatar"
        />
        <h2 style={{ marginTop: '15px', color: '#050505' }}>{profileUser.fullName}</h2>
        
        {/* Thống kê chỉ số */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', color: '#65676b', fontSize: '15px' }}>
          <span><strong>{userPosts.length}</strong> Bài viết</span>
          <span><strong>{totalLikes}</strong> Lượt thích nhận được ❤️</span>
        </div>

        {myId === String(userId) && (
          <button onClick={() => navigate('/edit-profile')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#d8dadf'} onMouseOut={(e) => e.target.style.backgroundColor = '#e4e6eb'}>
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '30px', color: '#65676b', fontSize: '18px' }}>Bài viết của {myId === String(userId) ? 'bạn' : profileUser.fullName}</h3>

      {/* Danh sách bài viết */}
      {userPosts.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#65676b' }}>Chưa có bài viết nào.</div>
      ) : (
        userPosts.map(post => (
          <div key={post.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '16px', color: '#050505', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{post.content}</p>
            
            {post.image && (
              <img src={post.image} style={{ width: '100%', borderRadius: '10px', marginBottom: '12px', maxHeight: '500px', objectFit: 'cover' }} alt="Post" />
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', color: '#65676b', fontSize: '13px' }}>
                <span>👍 {post.likes?.length || 0} lượt thích</span>
                <span>📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>

              {myId === String(userId) && (
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  style={{ color: '#f02849', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: '5px 10px', borderRadius: '5px' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fff0f0'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  🗑️ Xóa bài viết
                </button>
              )}
            </div>

            {/* Tích hợp phần bình luận dưới mỗi bài viết */}
            <div style={{ borderTop: '1px solid #eee', marginTop: '10px' }}>
              <CommentSection postId={post.id} currentUserId={myId} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;