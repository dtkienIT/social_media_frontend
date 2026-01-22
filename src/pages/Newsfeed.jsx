import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CreatePost from "../components/CreatePost";
import CommentSection from "../components/CommentSection";

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null); // State quản lý ảnh đang phóng to

  // Lấy thông tin xác thực từ localStorage
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");

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

  // Đảm bảo currentUserId luôn là String để so sánh chính xác với mảng likes
  const currentUserId =
    storedUserId && storedUserId !== "null" ? String(storedUserId) : null;

  // Hàm lấy danh sách bài viết từ Backend
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts/all");
      const sortedPosts = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Lỗi tải bài viết:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleLike = async (postId) => {
    if (!token) return alert("Vui lòng đăng nhập để thả tim!");
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Lỗi khi Like bài viết:", err);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>
        🚀 Đang tải bảng tin...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
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

      {/* --- THANH HEADER ĐIỀU HƯỚNG --- */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "20px", background: "#fff", padding: "10px 20px",
          borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          position: "sticky", top: "10px", zIndex: 100,
        }}
      >
        <h3
          style={{ color: "#1877f2", margin: 0, fontSize: "24px", cursor: "pointer" }}
          onClick={() => window.scrollTo(0, 0)}
        >
          SocialApp
        </h3>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {!token ? (
            <>
              <Link to="/login" style={{ textDecoration: "none", color: "#1877f2", fontWeight: "bold", fontSize: "14px" }}>Đăng nhập</Link>
              <Link to="/register" style={{ textDecoration: "none", backgroundColor: "#42b72a", color: "#fff", padding: "7px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px" }}>Đăng ký</Link>
            </>
          ) : (
            <>
              {currentUserId && (
                <Link to={`/profile/${currentUserId}`} style={{ textDecoration: "none", color: "#65676b", fontWeight: "bold", fontSize: "14px" }}>Trang cá nhân</Link>
              )}
              <button onClick={handleLogout} style={{ background: "#fa3e3e", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>Đăng xuất</button>
            </>
          )}
        </div>
      </div>

      {token && <CreatePost onPostCreated={fetchPosts} />}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        {posts.map((post) => {
          const isLiked = post.likes?.map(String).includes(currentUserId);

          return (
            <div key={post.id} style={{ background: "#fff", borderRadius: "8px", padding: "15px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <img
                  src={post.User?.avatar || "https://placehold.co/40"}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
                  alt="avatar"
                />
                <div>
                  <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "#050505", fontWeight: "bold", fontSize: "15px" }}>
                    {post.User?.fullName || "Người dùng"}
                  </Link>
                  <div style={{ color: "#65676b", fontSize: "12px" }}>
                    {new Date(post.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>

              <p style={{ whiteSpace: "pre-wrap", fontSize: "15px", color: "#050505", marginBottom: "10px" }}>
                {post.content}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  onClick={() => openImage(post.image)}
                  style={{
                    width: "100%", borderRadius: "8px", marginBottom: "10px",
                    maxHeight: "500px", objectFit: "cover", cursor: "zoom-in",
                  }}
                  alt="Post content"
                />
              )}

              <div style={{ marginTop: "10px", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "5px 0" }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                    color: isLiked ? "#e0245e" : "#65676b", fontSize: "14px", fontWeight: "600",
                    padding: "8px", width: "100%", borderRadius: "5px", transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f2f2f2")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span style={{ fontSize: "18px" }}>{isLiked ? "❤️" : "🤍"}</span>
                  {post.likes?.length || 0} Lượt thích
                </button>
              </div>

              <CommentSection postId={post.id} currentUserId={currentUserId} />
            </div>
          );
        })}
      </div>

      {posts.length === 0 && !loading && (
        <div style={{ textAlign: "center", color: "#65676b", marginTop: "50px" }}>
          <p>Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!</p>
        </div>
      )}
    </div>
  );
};

export default Newsfeed;