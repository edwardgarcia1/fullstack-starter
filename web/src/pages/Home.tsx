import React from 'react';
import { Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import AppLayout from '../layouts/AppLayout';

const Home: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <AppLayout currentTab="Dashboard" appName="Fullstack Starter">
      <Typography component="p" sx={{ mb: 2 }}>
        Welcome to the dashboard, {user?.name}!
      </Typography>
      <Typography component="p" sx={{ mb: 2 }}>
        This is a simple homepage layout using Material UI with a responsive sidebar and header.
        You can add more content here as needed.
      </Typography>
    </AppLayout>
  );
};

export default Home;