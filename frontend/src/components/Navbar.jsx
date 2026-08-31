import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, UserCircle } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await axios.post(
          'http://localhost:3001/api/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
    } finally {
      // Limpa o navegador mesmo se o token já estiver expirado
      // ou se houver falha de conexão.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="navbar-logo-icon">
            <Heart className="icon-heart" />
          </div>
          <span className="navbar-title">Jacaridade</span>
        </div>

        <div className="navbar-actions">
          <button onClick={() => navigate('/profile/edit')} className="btn-nav btn-edit">
            <UserCircle className="w-5 h-5" />
            <span>Editar Perfil</span>
          </button>
          
          <button onClick={handleLogout} className="btn-nav btn-logout">
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>

          {user?.profilePicture && (
            <img src={user.profilePicture} alt="Perfil" className="navbar-avatar" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;