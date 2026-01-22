import { useState } from 'react';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // LƯU CẢ TOKEN VÀ USERID (Cực kỳ quan trọng)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id); 

      alert("Đăng nhập thành công!");
      // Dùng window.location.href để làm mới toàn bộ trạng thái ứng dụng
      window.location.href = '/'; 
    } catch (err) {
      console.error(err);
      alert("Sai thông tin đăng nhập");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '100px auto' }}>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mật khẩu" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default Login;