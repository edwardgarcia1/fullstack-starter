import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../layouts/AppLayout';

const Home: React.FC = () => {
  const { user } = useAuth();

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