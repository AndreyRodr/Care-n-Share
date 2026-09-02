import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, UserCircle, ChevronDown, ChartLine} from 'lucide-react';
import axios from 'axios';
import Logo from './Logo.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
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

  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <Logo variant="horizontal" size={26} />
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
                onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                className="navbar-dropdown-item"
              >
                <ChartLine size={18} /> Estatísticas
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