import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  currentTab?: string;
  appName?: string;
}

const drawerWidth = 240;

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentTab = '', appName = import.meta.env.VITE_APP_NAME || 'App' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }}>
      <AppHeader onMenuClick={handleDrawerToggle} drawerWidth={drawerWidth} currentTab={currentTab} />
      <AppSidebar mobileOpen={mobileOpen} onToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, overflowX: 'hidden', minWidth: 0 }}
      >
        <Box sx={{ height: 64 }} />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
