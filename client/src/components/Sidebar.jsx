import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Target, CalendarDays, Briefcase,
  BookOpen, Flag, ChevronLeft, ChevronRight, LogOut, Zap, Code2
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const links = [
  { name: 'Dashboard',         icon: LayoutDashboard, path: '/' },
  { name: 'LeetCode Tracker',  icon: Code2,           path: '/leetcode' },
  { name: 'Platform Trackers', icon: Target,           path: '/trackers' },
  { name: 'Agenda',            icon: CalendarDays,     path: '/agenda' },
  { name: 'Interviews',        icon: Briefcase,        path: '/interviews' },
  { name: 'Study Hub',         icon: BookOpen,         path: '/study' },
  { name: 'Goals',             icon: Flag,             path: '/goals' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`h-screen fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 
        bg-dark-900/95 backdrop-blur-xl border-r border-white/5 shadow-xl
        ${collapsed ? 'w-[72px]' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-primary-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-primary-400 whitespace-nowrap">
            PrepTrack
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {links.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            end={path === '/'}
            title={collapsed ? name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
               ${collapsed ? 'justify-center' : ''}
               ${isActive
                 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                 : 'text-gray-500 hover:text-white hover:bg-dark-800'
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : ''}`} />
                {!collapsed && <span className="font-medium text-sm">{name}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-dark-800 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                    {name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-white/5 p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-800/60">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-300 hover:bg-dark-800 transition-all text-sm ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <><ChevronLeft className="w-4 h-4" /><span className="font-medium text-xs">Collapse</span></>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
