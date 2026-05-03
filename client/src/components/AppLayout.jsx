import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  LayoutDashboard, Code2, CalendarDays, BookOpen, Target, 
  Briefcase, Github, Settings, LogOut, Search, Bell, 
  Sun, Moon, Menu, X, ChevronLeft, ChevronRight, User
} from 'lucide-react';

const NAV_LINKS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leetcode', label: 'LeetCode Tracker', icon: Code2 },
  { path: '/agenda', label: 'Daily Agenda', icon: CalendarDays },
  { path: '/study', label: 'Study Hub', icon: BookOpen },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/trackers', label: 'Platform Trackers', icon: Github },
  { path: '/interviews', label: 'Interview Board', icon: Briefcase },
];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('preptrack_sidebar') === 'collapsed';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('preptrack_theme') || 'dark';
  });

  // Effects
  useEffect(() => {
    localStorage.setItem('preptrack_sidebar', isSidebarCollapsed ? 'collapsed' : 'expanded');
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('preptrack_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Handlers
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getPageTitle = () => {
    const link = NAV_LINKS.find(l => l.path === location.pathname);
    return link ? link.label : 'PrepTrack';
  };

  // Components
  const SidebarItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        } ${isSidebarCollapsed ? 'justify-center' : ''}`}
        title={isSidebarCollapsed ? item.label : undefined}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {!isSidebarCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 transition-colors duration-300">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden md:flex flex-col bg-[#0F172A] border-r border-slate-800 transition-all duration-300 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full p-1 z-10 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Logo Section */}
        <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-black text-white text-xl tracking-tight">PrepTrack</span>}
        </div>

        {/* User Profile */}
        <div className={`px-4 mb-6 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-800 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'Student'}</p>
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Student</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_LINKS.map(link => <SidebarItem key={link.path} item={link} />)}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <Settings className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span className="font-semibold text-sm">Settings</span>}
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-[#0F172A] h-full flex flex-col shadow-2xl animate-fade-in border-r border-slate-800">
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
              <span className="font-black text-white text-xl">PrepTrack</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {NAV_LINKS.map(link => (
                <NavLink key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <link.icon className="w-5 h-5" /> <span className="font-bold">{link.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-6 border-t border-slate-800 space-y-3">
              <button className="flex items-center gap-3 text-slate-400 font-bold"><Settings className="w-5 h-5" /> Settings</button>
              <button onClick={handleLogout} className="flex items-center gap-3 text-rose-400 font-bold"><LogOut className="w-5 h-5" /> Logout</button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-dark-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-white hidden sm:block">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Global Search */}
            <div className="hidden lg:flex relative w-64 xl:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search tasks, goals, problems..." className="w-full bg-dark-950 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors" title="Toggle Theme">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-dark-900"></span>
              </button>
              <button className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-dark-900 shadow-md">
                <span className="text-xs font-bold text-white">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden shrink-0 border-t border-white/5 bg-[#0F172A] flex items-center justify-around px-2 py-2 safe-area-bottom z-40">
          {NAV_LINKS.slice(0, 4).map(link => (
            <NavLink key={link.path} to={link.path} className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{link.label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-500 transition-all">
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold">More</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
