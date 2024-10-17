import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

function CustomAppBar({ title }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar color='primary' sx={{ top: '90%', position: '-webkit-sticky', marginBottom: 6 }} >
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }} style={{ fontSize: isSmallScreen ? '13px' : '16px', textAlign: isSmallScreen ? 'center' : 'left' }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>

  );
}

export default CustomAppBar;
