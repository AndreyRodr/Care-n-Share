import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-cozy-accent/10 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-cozy-accent/20 p-2 rounded-xl">
            <Heart className="w-6 h-6 text-cozy-accent fill-cozy-accent" />
          </div>
          <span className="text-xl font-bold text-cozy-text tracking-tight">Jacaridade</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2 px-4 py-2 text-cozy-text/70 hover:text-cozy-accent hover:bg-cozy-accent/5 rounded-xl transition-all"
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Editar Perfil</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Sair</span>
          </button>

          {user?.profilePicture && (
            <img 
              src={user.profilePicture} 
              alt="Perfil" 
              className="w-10 h-10 rounded-full border-2 border-cozy-accent/20 object-cover ml-2"
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
