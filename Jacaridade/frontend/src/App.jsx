import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';
import EditProfile from './pages/EditProfile.jsx';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cozy-bg text-cozy-text font-sans selection:bg-cozy-accent/20">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/profile/edit" 
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
