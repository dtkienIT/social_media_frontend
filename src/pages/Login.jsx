import { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng sang Register
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHover, setIsHover] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id); 

      toast.success("🚀 Đăng nhập thành công!");
      window.location.href = '/'; 
    } catch (err) {
      console.error(err);
      toast.error("Sai thông tin đăng nhập");
    }
  };

  // Các style hiện đại
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
    margin: '10px 0',
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
    backgroundColor: isHover ? '#166fe5' : '#1877f2',
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
        <h1 style={{ color: '#1877f2', marginBottom: '10px', fontSize: '32px' }}>KaWeb</h1>
        <p style={{ color: '#606770', marginBottom: '20px', fontSize: '15px' }}>Chào mừng bạn quay trở lại!</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <input 
            type="email" 
            placeholder="Email hoặc số điện thoại" 
            onChange={e => setEmail(e.target.value)} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#1877f2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
            required 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            onChange={e => setPassword(e.target.value)} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#1877f2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
            required 
          />
          <button 
            type="submit" 
            style={buttonStyle}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            Đăng nhập
          </button>
        </form>

        <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        
        <div style={{ fontSize: '14px', color: '#606770' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#1877f2', textDecoration: 'none', fontWeight: 'bold' }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;