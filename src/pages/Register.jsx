import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1877f2' }}>Đăng ký</h2>
        <input type="text" placeholder="Họ và tên" required onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input type="password" placeholder="Mật khẩu" required onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <button type="submit" style={{ padding: '10px', background: '#42b72a', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Đăng ký</button>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#1877f2', textDecoration: 'none' }}>Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;