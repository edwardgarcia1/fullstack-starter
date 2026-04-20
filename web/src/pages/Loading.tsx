import React from 'react';
import { Box, Typography, CircularProgress, Skeleton } from '@mui/material';
import { keyframes } from '@mui/material/styles';

// Define keyframe animation for floating effect
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        padding: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          animation: `${float} 2s ease-in-out infinite`,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
          Loading...
        </Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 400, mt: 6, gap: 2, display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  );
};

export default Loading;
