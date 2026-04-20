import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppHeaderProps {
  onMenuClick: () => void;
  drawerWidth: number;
  currentTab: string;
  onCollapseClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, drawerWidth, currentTab, onCollapseClick }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        {/* Mobile menu button (hidden on md+) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        {/* Desktop collapse button (visible on md+) */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onCollapseClick}
          sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {currentTab || 'Fullstack Starter'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
