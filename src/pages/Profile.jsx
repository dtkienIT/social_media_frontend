import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import CommentSection from '../components/CommentSection';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null); // State quản lý ảnh đang phóng to

  // --- LOGIC PHÓNG TO ẢNH ---
    const openImage = (url) => {
      setSelectedImg(url);
      document.body.style.overflow = "hidden"; // Ngăn cuộn trang
    };
  
    const closeImage = useCallback(() => {
      setSelectedImg(null);
      document.body.style.overflow = "auto"; // Cho phép cuộn lại
    }, []);
  
    // Lắng nghe phím ESC để đóng ảnh
    useEffect(() => {
      const handleEsc = (event) => {
        if (event.keyCode === 27) closeImage();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [closeImage]);
  
  // Lay Id
  const myId = String(localStorage.getItem('userId') || "").trim();

  
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      // Sử dụng route duy nhất đã test thành công trên Postman
      const res = await api.get(`/users/profile/${userId}`);
      
      if (res.data && res.data.user) {
        const userData = res.data.user;
        setProfileUser(userData);
        
        // Lấy mảng Posts từ trong object user
        // Lưu ý: Sequelize trả về "Posts" (chữ P viết hoa)
        const posts = userData.Posts || [];
        setUserPosts(posts);

        // Tính tổng like dựa trên dữ liệu thật trả về
        const total = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
        setTotalLikes(total);
      }
    } catch (err) {
      console.error("Lỗi tải Profile:", err);
      setProfileUser(null);
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
      toast.success("Đã xóa bài viết thành công!");
      
      // Cập nhật giao diện ngay lập tức
      setUserPosts(prev => {
        const updated = prev.filter(p => p.id !== postId);
        setTotalLikes(updated.reduce((acc, p) => acc + (p.likes?.length || 0), 0));
        return updated;
      });
    } catch  {
      toast.error("Không thể xóa bài viết này.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải...</div>;
  
  // Hiển thị lỗi nếu không lấy được user
  if (!profileUser) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h3>Không tìm thấy người dùng.</h3>
      <Link to="/">Quay lại Bảng tin</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>
      
      {/* --- MODAL PHÓNG TO ẢNH --- */}
      {selectedImg && (
        <div 
          onClick={closeImage}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 2000, cursor: 'zoom-out'
          }}
        >
          <img 
            src={selectedImg} 
            alt="Large view" 
            style={{ maxWidth: '95%', maxHeight: '95%', borderRadius: '4px', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()} // Không đóng khi click vào ảnh
          />
          <span style={{ position: 'absolute', top: '20px', right: '30px', color: '#fff', fontSize: '40px', cursor: 'pointer' }}>&times;</span>
        </div>
      )}

      {/* Header Profile */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <img 
          src={profileUser.avatar || 'https://placehold.co/150'} 
          onClick={() => openImage(profileUser.avatar || "https://placehold.co/150")}
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          alt="Avatar"
        />
        <h2 style={{ marginTop: '15px', color: '#050505' }}>{profileUser.fullName}</h2>
        
        {/* Thống kê bài viết và like */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', color: '#65676b' }}>
          <span><strong>{userPosts.length}</strong> Bài viết</span>
          <span><strong>{totalLikes}</strong> Lượt thích ❤️</span>
        </div>

        {myId === String(userId) && (
          <button 
            onClick={() => navigate('/edit-profile')} 
            style={{ marginTop: '15px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ⚙️ Chỉnh sửa thông tin cá nhân
          </button>
        )}
      </div>

      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết của {myId === String(userId) ? 'bạn' : profileUser.fullName}</h3>

      {/* Danh sách bài viết */}
      {userPosts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '16px', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{post.content}</p>
          
          {post.image && (
            <img src={post.image} style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} alt="Post" />
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <span style={{ color: '#65676b', fontSize: '12px' }}>
              👍 {post.likes?.length || 0} lượt thích · {new Date(post.createdAt).toLocaleDateString('vi-VN')}
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

          {/* Phần bình luận tích hợp */}
          <div style={{ marginTop: '10px' }}>
            <CommentSection postId={post.id} currentUserId={myId} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;