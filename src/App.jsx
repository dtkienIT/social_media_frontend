import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Newsfeed from './pages/Newsfeed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Newsfeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;