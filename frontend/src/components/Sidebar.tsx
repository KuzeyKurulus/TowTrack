import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/jobs', label: 'İşler', icon: '🚛' },
  { to: '/customers', label: 'Müşteriler', icon: '👥' },
  { to: '/vehicles', label: 'Araçlar', icon: '🚗' },
  { to: '/towtrucks', label: 'Çekiciler', icon: '🛻' },
  { to: '/drivers', label: 'Sürücüler', icon: '🧑‍✈️' },
  { to: '/reports', label: 'Raporlar', icon: '📈' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`tt-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="tt-sidebar-brand">
        <span>Tow</span>
        <span className="tt-brand-accent">Track</span>
      </div>
      <nav className="d-flex flex-column">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `tt-nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
