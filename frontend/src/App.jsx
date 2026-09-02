import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';
import Landing from './pages/Landing.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Toaster from './components/Toaster.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DonationManage from './pages/DonationManage.jsx';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Visitante vê a landing page; quem já está logado cai direto no feed.
const HomeRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Feed /> : <Landing />;
};

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donations" element={<DonationManage />} />
          <Route path="/" element={<HomeRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;