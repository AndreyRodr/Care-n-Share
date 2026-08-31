import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';

const Footer = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-brand">
          <Logo variant="horizontal" size={22} />
          <p className="site-footer-tagline">Conectando corações e causas que precisam de você.</p>
        </div>

        <nav className="site-footer-links">
          <span className="site-footer-heading">Navegação</span>
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/')}>Feed</button>
              <button onClick={() => navigate('/profile/edit')}>Editar Perfil</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Entrar</button>
              <button onClick={() => navigate('/register')}>Criar conta</button>
            </>
          )}
        </nav>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Care n' Share. Conectando corações e causas.</span>
      </div>
    </footer>
  );
};

export default Footer;
