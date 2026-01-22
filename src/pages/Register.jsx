import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      
      await api.post('/auth/register', formData);
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  // Hệ thống Style đồng bộ với trang Login
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '8px 0',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: isHover ? '#36a420' : '#42b72a', // Màu xanh lá cây đặc trưng nút Register
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#1877f2', marginBottom: '5px', fontSize: '32px' }}>Kaweb</h1>
        <h2 style={{ color: '#050505', marginBottom: '10px', fontSize: '24px' }}>Tạo tài khoản mới</h2>
        <p style={{ color: '#606770', marginBottom: '20px', fontSize: '15px' }}>Nhanh chóng và dễ dàng.</p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
          <input 
            type="text" 
            placeholder="Họ và tên" 
            required 
            onChange={e => setFormData({...formData, fullName: e.target.value})} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#1877f2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <input 
            type="email" 
            placeholder="Email" 
            required 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#1877f2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <input 
            type="password" 
            placeholder="Mật khẩu mới" 
            required 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#1877f2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          
          <button 
            type="submit" 
            style={buttonStyle}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            Đăng ký
          </button>
        </form>

        <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        
        <div style={{ fontSize: '15px', color: '#606770' }}>
          Bạn đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#1877f2', textDecoration: 'none', fontWeight: 'bold' }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;