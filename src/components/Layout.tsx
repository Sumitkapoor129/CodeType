import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Terminal, LogOut, Linkedin, Instagram, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-brand-500 bg-brand-500/10'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800';

  return (
    <div className="min-h-screen w-full flex flex-col bg-dark-bg text-dark-text font-sans overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <nav className="w-full border-b border-slate-800 bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
           <a href="/" className="flex items-center gap-2 shrink-0">
  <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-white">
    <Terminal size={18} />
  </div>
  <span className="text-base sm:text-xl font-bold text-white whitespace-nowrap">
    Code<span className="text-brand-500">Typer</span>
  </span>
</a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}
              >
                Typing Test
              </Link>

              <Link
                to="/leaderboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/leaderboard')}`}
              >
                Leaderboard
              </Link>

              {isAuthenticated && (
                <Link
                  to="/learn"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/learn')}`}
                >
                  Learn
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-sm text-slate-200 font-medium">
                        {user.name}
                      </span>
                      <span className="text-xs text-brand-400">
                        Lvl {user.level} • {user.xp} XP
                      </span>
                    </div>

                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-slate-600"
                    />

                    <button
                      onClick={logout}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={login}
                    className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-slate-300"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div className="md:hidden w-full bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">

            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              Typing Test
            </Link>

            <Link
              to="/leaderboard"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/leaderboard')}`}
            >
              Leaderboard
            </Link>

            {isAuthenticated && (
              <Link
                to="/learn"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/learn')}`}
              >
                Learn
              </Link>
            )}

            <div className="border-t border-slate-800 pt-3">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-red-400 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="w-full bg-white text-slate-900 py-2 rounded-lg font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full border-t border-slate-800 py-6">
        <div className="w-full max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm flex flex-col items-center gap-4">
          <p>© 2026 CodeTyper by Sumit Kapoor. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/sumitkapoor001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-brand-500 transition-colors"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="https://www.instagram.com/sumit_kapoor_001/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-brand-500 transition-colors"
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
