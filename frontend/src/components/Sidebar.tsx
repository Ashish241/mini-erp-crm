import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  LogOut,
  User as UserIcon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen 
}) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { name: 'Customers', path: '/customers', icon: Users, roles: ['ADMIN', 'SALES', 'ACCOUNTS'] },
    { name: 'Products', path: '/products', icon: Package, roles: ['ADMIN', 'WAREHOUSE', 'ACCOUNTS'] },
    { name: 'Challans', path: '/challans', icon: FileText, roles: ['ADMIN', 'SALES', 'ACCOUNTS'] },
  ];

  const visibleNavs = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'mobile-open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        
        <div style={{ 
          padding: isCollapsed ? '1.5rem 0' : '1.5rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between'
        }}>
          {!isCollapsed && <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>MINI ERP</h2>}
          {isCollapsed && <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.25rem' }}>ERP</h2>}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn-icon desktop-toggle-btn" 
          >
             {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0.5rem', overflowY: 'auto' }}>
          {visibleNavs.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? '0' : '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#1C1917' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                marginBottom: '0.5rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              })}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon size={20} strokeWidth={2.5} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
        
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'flex-start',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'var(--accent-light)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hover)'
            }}>
              <UserIcon size={18} />
            </div>
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.role}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={logout} 
            className="btn-icon" 
            style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '0.75rem', color: 'var(--status-danger)' }}
            title="Logout"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};
