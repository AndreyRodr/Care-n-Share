import React, { useState } from 'react';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/'; // Redirecionar forçando recarregamento
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao realizar login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-cozy-accent/10 p-8 border border-cozy-accent/5">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cozy-accent/20 rounded-2xl mb-4">
            <Heart className="text-cozy-accent w-8 h-8 fill-cozy-accent" />
          </div>
          <h1 className="text-3xl font-bold text-cozy-text mb-2">Bem-vindo de volta</h1>
          <p className="text-cozy-text/60">Ficamos felizes em ver você novamente por aqui.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-cozy-pastel-pink/30 border border-cozy-pastel-pink text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cozy-text/70 mb-2 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cozy-accent/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full pl-12 pr-4 py-3 bg-cozy-bg rounded-2xl border-none focus:ring-2 focus:ring-cozy-accent/30 outline-none transition-all placeholder:text-cozy-text/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cozy-text/70 mb-2 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cozy-accent/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-cozy-bg rounded-2xl border-none focus:ring-2 focus:ring-cozy-accent/30 outline-none transition-all placeholder:text-cozy-text/30"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-cozy-accent text-white font-semibold rounded-2xl shadow-lg shadow-cozy-accent/30 hover:bg-cozy-accent/90 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Entrar
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-cozy-text/50">
            Ainda não tem uma conta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-cozy-accent font-bold hover:underline"
            >
              Crie uma agora
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
