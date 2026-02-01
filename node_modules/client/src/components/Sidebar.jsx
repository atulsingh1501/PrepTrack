import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, CalendarDays, Briefcase, BookOpen, Flag } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Platform Trackers', icon: Target, path: '/trackers' },
    { name: 'Agenda', icon: CalendarDays, path: '/agenda' },
    { name: 'Interviews', icon: Briefcase, path: '/interviews' },
    { name: 'Study Hub', icon: BookOpen, path: '/study' },
    { name: 'Goals', icon: Flag, path: '/goals' }
  ];

  return (
    <div className="w-64 bg-dark-800/80 backdrop-blur-xl border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col p-4 shadow-glass z-50">
      <div className="flex items-center gap-3 px-2 mb-10 mt-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20"></div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
          PrepTrack
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
