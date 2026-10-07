import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, UserCircle, ChevronDown, ChartLine, HandCoins} from 'lucide-react';
import api from '../services/api.js';
import Logo from './Logo.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <Logo variant="horizontal" size={26} />
        </div>
        <div className="navbar-routes-container">
          <button 
            onClick={() => { navigate('/dashboard'); }}
            className='navbar-routes-btn'
          >Estatisticas</button>
          <button 
            onClick={() => { navigate('/donations'); }}
            className='navbar-routes-btn middle'
          >Gerenciar Doações</button>
          <button 
            onClick={() => { navigate('/inventory'); }}
            className='navbar-routes-btn'
          >Gerenciar Inventário</button>
        </div>
        <div className="navbar-actions" ref={menuRef}>
          <button
            className="navbar-avatar-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu da conta"
            aria-expanded={menuOpen}
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Perfil" className="navbar-avatar" />
            ) : (
              <span className="navbar-avatar navbar-avatar--fallback">{initials}</span>
            )}
            <ChevronDown size={16} className={`navbar-avatar-chevron ${menuOpen ? 'is-open' : ''}`} />
          </button>

          {menuOpen && (
            <div className="navbar-dropdown">
              <button
                onClick={() => { setMenuOpen(false); navigate('/profile/edit'); }}
                className="navbar-dropdown-item"
              >
                <UserCircle size={18} /> Editar Perfil
              </button>
              <button
                className="navbar-dropdown-item"
              >
                <HandCoins size={18} /> Gerenciar Doações
              </button>
              <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-item--danger">
                <LogOut size={18} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;