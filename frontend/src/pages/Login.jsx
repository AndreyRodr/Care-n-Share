import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Compass, Heart, LayoutList } from 'lucide-react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  usePageTitle('Entrar');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao realizar login. Tente novamente.');
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-brand-panel">
        <Logo variant="stacked" tone="mono" size={40} />

        <p className="auth-brand-tagline">Conectando corações e causas que precisam de você.</p>

        <div className="auth-brand-features">
          <div className="auth-brand-feature">
            <span className="auth-brand-feature-icon"><Compass size={20} /></span>
            Descubra ONGs com match por interesse
          </div>
          <div className="auth-brand-feature">
            <span className="auth-brand-feature-icon"><Heart size={20} /></span>
            Doe via PIX com QR Code instantâneo
          </div>
          <div className="auth-brand-feature">
            <span className="auth-brand-feature-icon"><LayoutList size={20} /></span>
            Acompanhe o mural de atualizações das causas
          </div>
        </div>
      </aside>

      <div className="auth-form-panel">
        <div className="login-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Logo size={32} />
          </div>
          <h1 className="login-title">Bem-vindo de volta</h1>
          <p className="login-subtitle">Ficamos felizes em ver você novamente por aqui.</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Entrar
            <ArrowRight />
          </button>
        </form>

        <div className="login-footer">
          <p>
            Ainda não tem uma conta?{' '}
            <button onClick={() => navigate('/register')}>
              Crie uma agora
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;