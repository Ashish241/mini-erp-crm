import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Mobile Toggle inside content area for when sidebar is fully hidden on mobile */}
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="btn-icon mobile-toggle-btn"
        >
          <Menu size={24} />
        </button>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
