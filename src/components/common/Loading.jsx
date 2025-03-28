import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100px"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 9999
      }}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <Typography variant="body1" mt={2} color="textSecondary">
        Đang tải...
      </Typography>
    </Box>
  );
};

export default Loading;