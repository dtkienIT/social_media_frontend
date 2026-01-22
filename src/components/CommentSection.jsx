import React, { useState, useEffect } from 'react';
import api from '../api';

const CommentSection = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy danh sách bình luận khi bài viết hiển thị
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Lỗi tải bình luận:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // Xử lý gửi bình luận mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    try {
      setLoading(true);
      // Gọi API POST /api/comments
      const res = await api.post('/comments', { 
        content: newComment, 
        postId 
      });
      
      // Thêm bình luận mới vào danh sách hiện tại để hiển thị ngay
      setComments([...comments, res.data]);
      setNewComment('');
    } catch  {
      alert("Không thể gửi bình luận. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
      {/* Danh sách các bình luận đã có */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <img 
              src={comment.User?.avatar || 'https://placehold.co/32'} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
              alt="avatar" 
            />
            <div style={{ backgroundColor: '#e4e6eb', padding: '8px 12px', borderRadius: '18px', maxWidth: '85%' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#050505' }}>
                {comment.User?.fullName}
              </div>
              <div style={{ fontSize: '14px', color: '#050505', wordBreak: 'break-word' }}>
                {comment.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ô nhập bình luận mới */}
      {currentUserId && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            style={{ 
              flex: 1, border: 'none', borderRadius: '20px', padding: '10px 15px', 
              fontSize: '14px', outline: 'none', backgroundColor: '#fff' 
            }}
          />
          <button 
            type="submit" 
            disabled={!newComment.trim() || loading}
            style={{ 
              background: 'none', border: 'none', color: '#1877f2', 
              cursor: 'pointer', fontWeight: 'bold', opacity: newComment.trim() ? 1 : 0.5 
            }}
          >
            Gửi
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;