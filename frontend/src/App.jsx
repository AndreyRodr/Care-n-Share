import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';
import Landing from './pages/Landing.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Toaster from './components/Toaster.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DonationManage from './pages/DonationManage.jsx';
import InventoryManage from './pages/InventoryManage.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

const SessionLoading = () => (
  <div className="app-wrapper">
    <p>Verificando sessão...</p>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SessionLoading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const HomeRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SessionLoading />;
  }

  return isAuthenticated ? <Feed /> : <Landing />;
};

function AppContent() {
  return (
    <div className="app-wrapper">
      <Toaster />

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
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <PrivateRoute>
              <DonationManage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryManage />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<HomeRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;