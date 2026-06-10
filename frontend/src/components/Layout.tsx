import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'VOCABULARY', path: '/', icon: 'menu_book' },
    { label: 'FLASHCARDS', path: '/flashcards', icon: 'database' }, // Using database icon for archive/flashcards feel
    { label: 'QUIZ', path: '/quiz', icon: 'sensors' },
    { label: 'APPEND', path: '/add', icon: 'add' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
      {/* Global Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanlines opacity-20"></div>

      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full flex flex-col z-50 bg-black/90 backdrop-blur-2xl border-r border-[#4f4165]/20 shadow-[10px_0_30px_rgba(0,0,0,0.5)] w-64 md:flex hidden">
        <div className="p-6">
          <Link to="/">
            <h1 className="text-xl font-black text-primary font-headline tracking-[0.2em] uppercase">DEUTSCH_CORE</h1>
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-highest border border-primary/20 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-surface-bright flex items-center justify-center text-primary font-headline font-bold">A1</div>
            </div>
            <div>
              <p className="font-headline text-[10px] font-bold tracking-[0.2em] text-primary uppercase">ARCHIVE_01</p>
              <p className="font-headline text-[8px] tracking-[0.2em] text-secondary">OPERATOR: ACTIVE</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 mt-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`group flex items-center gap-4 px-4 py-3 font-headline text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-secondary border-l-4 border-secondary bg-secondary/10 drop-shadow-[0_0_10px_rgba(0,241,253,0.4)]'
                    : 'text-purple-400/40 hover:text-purple-100 hover:bg-primary/5'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-[#4f4165]/20">
          <div className="mb-4 text-center">
            <p className="text-[10px] text-primary/60 font-headline uppercase truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-error/10 text-error border border-error/30 py-3 font-headline font-black text-[10px] tracking-widest uppercase hover:bg-error hover:text-white transition-all"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="md:ml-64 min-h-screen grid-pattern relative flex flex-col">
        {/* TopNavBar */}
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-[#4f4165]/15 shadow-[0_4px_20px_rgba(20,7,39,1)] flex justify-between items-center w-full px-6 py-4 h-20 sticky top-0 z-40">
          <div className="flex items-center gap-8 flex-1">
            <div className="hidden lg:block">
              <span className="text-2xl font-bold tracking-[0.2em] uppercase text-primary drop-shadow-[0_0_8px_rgba(255,124,245,0.5)] font-headline">
                {navItems.find(i => i.path === location.pathname)?.label || 'DEUTSCH_CORE'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-purple-300/50">
              <button className="material-symbols-outlined hover:text-primary hover:bg-white/5 p-2 transition-all duration-300 active:scale-95">notifications</button>
              <button className="material-symbols-outlined hover:text-primary hover:bg-white/5 p-2 transition-all duration-300 active:scale-95">settings</button>
            </div>
            <div className="w-10 h-10 border border-primary/30 flex items-center justify-center bg-surface-container-high">
               <span className="material-symbols-outlined text-primary">person</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex-1">
          <Outlet />
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-[#4f4165]/15 flex justify-around items-center h-16 z-[60]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all ${
                  isActive ? 'text-secondary drop-shadow-[0_0_5px_rgba(0,241,253,0.8)]' : 'text-purple-300/50 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
