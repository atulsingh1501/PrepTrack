import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/',          label: 'Dashboard' },
  { to: '/leetcode',  label: 'LeetCode'  },
  { to: '/skills',    label: 'Skills & Git' },
  { to: '/tasks',     label: 'Daily Tasks' },
  { to: '/resources', label: 'Resources'  },
  { to: '/goals',     label: 'Goals'      },
  { to: '/profiles',  label: 'Profiles'   },
];

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <span className="nav-brand">
        <span className="dot" />
        PrepTrack
      </span>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
      <button className="nav-logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
