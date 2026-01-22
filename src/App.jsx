import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Pages
import Newsfeed from './pages/Newsfeed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Router>
      {/* Cấu hình thông báo toàn cục (Toast) */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="app-container" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <Routes>
          {/* Trang chủ - Bảng tin */}
          <Route path="/" element={<Newsfeed />} />
          
          {/* Xác thực */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Người dùng & Cá nhân */}
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          
          {/* trang 404 */}
          <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}>404 - Không tìm thấy trang</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;