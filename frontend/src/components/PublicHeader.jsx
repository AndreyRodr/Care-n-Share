import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';

// Header público (landing/marketing) — diferente da Navbar do app, sem avatar/dropdown de conta.
const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="public-header">
      <div className="public-header-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <Logo variant="horizontal" size={26} />
        </div>
        <nav className="public-header-nav">
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#faq">Dúvidas</a>
        </nav>
        <div className="public-header-actions">
          <button className="btn-nav-link" onClick={() => navigate('/login')}>Entrar</button>
          <button className="btn-nav-cta" onClick={() => navigate('/register')}>Criar conta</button>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
