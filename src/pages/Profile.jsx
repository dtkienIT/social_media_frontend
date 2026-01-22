import React, { useEffect, useState, useCallback } from 'react';

import { useParams, useNavigate, Link } from 'react-router-dom';

import api from '../api';



const Profile = () => {

  const { userId } = useParams();

  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);

  const [userPosts, setUserPosts] = useState([]);

  const [loading, setLoading] = useState(true);

 

  const myId = String(localStorage.getItem('userId') || "").trim();



  const fetchProfileData = useCallback(async () => {

    try {

      setLoading(true);

      // 1. Lấy thông tin User

      const userRes = await api.get(`/users/${userId}`);

      setProfileUser(userRes.data.user);



      // 2. Lấy danh sách bài viết

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



  // Logic xóa bài viết khớp với route router.delete('/:id')

  const handleDeletePost = async (postId) => {

    if (!window.confirm("Bạn có muốn xóa bài viết này không?")) return;



    try {

      // Gọi đến router.delete('/:id') trong post.routes.js

      await api.delete(`/posts/${postId}`);

      alert("Đã xóa bài viết thành công!");

     

      // Cập nhật State để xóa bài viết khỏi giao diện ngay lập tức

      setUserPosts(prevPosts => prevPosts.filter(p => p.id !== postId));

    } catch (err) {

      console.error("Lỗi xóa bài viết:", err);

      alert(err.response?.data?.message || "Không thể xóa bài viết này.");

    }

  };



  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải...</div>;

  if (!profileUser) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Không tìm thấy người dùng.</div>;



  return (

    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2', fontWeight: 'bold' }}>← Quay lại Bảng tin</Link>

     

      {/* Header Profile */}

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>

        <img

          src={profileUser.avatar || 'https://placehold.co/150'}

          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }}

          alt="Avatar"

        />

        <h2 style={{ marginTop: '15px' }}>{profileUser.fullName}</h2>

        {myId === String(userId) && (

          <button onClick={() => navigate('/edit-profile')} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#e4e6eb', fontWeight: 'bold', cursor: 'pointer' }}>

            ⚙️ Chỉnh sửa thông tin cá nhân

          </button>

        )}

      </div>



      <h3 style={{ marginTop: '30px', color: '#65676b' }}>Bài viết của bạn</h3>



      {/* Danh sách bài viết */}

      {userPosts.map(post => (

        <div key={post.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

          <p style={{ fontSize: '16px', marginBottom: '10px' }}>{post.content}</p>

         

          {post.image && (

            <img src={post.image} style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} alt="Post" />

          )}

         

          {/* Footer bài viết: Ngày đăng bên trái, Nút xóa bên phải */}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '10px' }}>

            <span style={{ color: '#65676b', fontSize: '12px' }}>

              Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}

            </span>



            {/* Chỉ hiện nút xóa nếu xem profile của chính mình */}

            {myId === String(userId) && (

              <button

                onClick={() => handleDeletePost(post.id)}

                style={{

                  color: '#f02849',

                  background: 'none',

                  border: 'none',

                  cursor: 'pointer',

                  fontSize: '13px',

                  fontWeight: '600',

                  padding: '4px 8px',

                  borderRadius: '4px'

                }}

                onMouseOver={(e) => e.target.style.backgroundColor = '#fff0f0'}

                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}

              >

                🗑️ Xóa bài viết

              </button>

            )}

          </div>

        </div>

      ))}

    </div>

  );

};



export default Profile;