import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { Terminal, LogOut, Linkedin, Instagram } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-brand-500 bg-brand-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800';

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-white">
                  <Terminal size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Code<span className="text-brand-500">Typer</span></span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>
                   Typing Test
                </Link>
                <Link to="/leaderboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/leaderboard')}`}>
                   Leaderboard
                </Link>
                {isAuthenticated && (
                    <Link to="/learn" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/learn')}`}>
                    Learn
                    </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-200">{user.name}</span>
                    <span className="text-xs text-brand-400">Lvl {user.level} • {user.xp} XP</span>
                  </div>
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-600" />
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

       {/* Footer */}
<footer className="border-t border-slate-800 mt-auto py-8">
 <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm flex flex-col items-center gap-4">
  
  <p>© 2026 CodeTyper by Sumit Kapoor. All rights reserved.</p>

  <div className="flex items-center gap-5">
   <a
    href="https://www.linkedin.com/in/sumitkapoor001"
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-500 hover:text-brand-500 transition-colors"
    aria-label="LinkedIn"
   >
    <Linkedin size={18} />
   </a>

   <a
    href="https://www.instagram.com/sumit_kapoor_001/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-500 hover:text-brand-500 transition-colors"
    aria-label="Instagram"
   >
    <Instagram size={18} />
   </a>
  </div>

 </div>
</footer>
</div>
);
};
export default Layout;
