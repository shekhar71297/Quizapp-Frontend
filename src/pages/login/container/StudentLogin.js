import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@mui/material';
import CustomAppBar from '../../../component/common/CustomAppBar';
import { loginActions } from '../loginSliceReducer';
import { Get, Post } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { userActions } from '../../user/userSliceReducer';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import logoimg from '../../../asset/img/Hematite Logo.jpg'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as validation from '../../../utils/constant';



export default function Login() {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('info');
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const { allUser } = useSelector((store) => store.user);
  const { token } = useSelector((store) => store.login);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const copyrightText = `© 2017-${currentYear} Hematite Infotech, All Rights Reserved.`;
  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
  });

  useEffect(() => {
    Get(`${urls.user}`)
      .then((response) => {
        const reversedUsers = response.data.reverse(); // Reverse the array of users
        dispatch(userActions.getUser(reversedUsers));
      })
      .catch((error) => console.log('user error: ', error));
  }, []);

  useEffect(() => {
    if (token && sessionStorage.getItem('accessToken')) {
      if (sessionStorage.getItem('role') === 'student' || sessionStorage.getItem('role') === 'intern') {
        nav('/quizapp');
      } else if (sessionStorage.getItem('role') === 'admin') {
        nav('/dashboard/student');
      }
    }
  }, [token, nav]);
  //-------------------------------------handle submit------------------------------------//
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    if (loginData.email === '' && loginData.password === '') {
      handleSnackbarOpen('Please enter login credentials', 'error');
      return;
    }
    const user = allUser.find((user) => user.email === loginData.email);
    if (!user) {
      handleSnackbarOpen('Invalid email or password', 'error');
      return;
    }

    // Login successful, save user details to session storage
    const firstName = capitalizeFirstLetter(user.fname);
    const lastName = capitalizeFirstLetter(user.lname);
    sessionStorage.setItem('user', firstName + ' ' + lastName);
    sessionStorage.setItem('role', user.role);
    sessionStorage.setItem('studentId', user.id)


    Post(`${urls.token}`, loginData)
      .then((response) => {
        handleSnackbarOpen('Login successful', 'success');
        if (response?.access) {
          setTimeout(() => {        
          sessionStorage.setItem('accessToken', response?.access);
          dispatch(loginActions.LOGIN_SUCCESS(response?.access));
          // Redirect based on user role
         
            if (user.role === 'student' || user.role === 'intern') {
              nav('/voucher');
            } else if (user.role === 'trainer' || user.role === 'counsellor') {
              nav('/dashboard/exam');
            } else {
              nav('/dashboard/student');
            }
          }, 2000)
        }
      })
      .catch((error) => {
        handleSnackbarOpen('Error occurred during login', 'error');
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };



  const handleFeedbackFormClick = (e) => {
    e.preventDefault()
    nav('/student-feedback'); // Navigate to the feedback form page
  };

  const handleForgetPassword = (e) => {
    e.preventDefault()
    nav('/forgetpassword'); // Navigate to the forgot password form page
  };



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'password' ) {
      const isPasswordError = !validation.isValidPassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: isPasswordError,
      }));
    }

    if (name === 'email') {
      const isEmailError = !validation.isValidEmail(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailError: isEmailError,
      }));
    }
  }

  const handleStudent = () => {

    nav('/student-registration')
    handleClose();
  };

  const handleEmployee = () => {

    nav('/employee-registration')
    handleClose();
  };

  return (
    <>
      {/* <CustomAppBar title='Hematite Infotech Online-Quiz' /> */}
      <AppBar color='primary' position="sticky">
        <Toolbar >
          <div style={{ display: 'flex', marginRight: '10px' }} >
            <img style={{ width: isSmallScreen ? '40px' : "50px", height: isSmallScreen ? '36px' : "46px", borderRadius: "64%", boxShadow: "white 0px 0px 6px -1px" }} src={logoimg} alt="logoimg" />
          </div>
          <Typography sx={{ flexGrow: 1, textAlign: 'left', width: '90px', fontSize: isSmallScreen ? '13px' : '20px' }} >
            Hematite Infotech Online-Quiz
          </Typography>

          <Button
            id="basic-menu"
            aria-controls={anchorEl ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            onClick={handleClick}
            variant="outlined"
            size='small'
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: '#FFFFFF', // Specify same color for hover state
              }
            }}
          >
            Sign up
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleStudent}>Student</MenuItem>
            <MenuItem onClick={handleEmployee}>Employee</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container component='main' maxWidth='xs' >
        <CssBaseline />
        <Box
          sx={{
            marginTop: isSmallScreen ? 3 : 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'sticky',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography sx={{ color: 'primary.main', fontSize: isSmallScreen ? '18px' : '20px' }}>
            Login
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onBlur={handleBlur}
              inputProps={{ maxLength: 30 }}
              size='small'
              error={errors.emailError}
              helperText={(errors.emailError && validation.errorText("Invalid email"))}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type={passwordVisibility ? 'text' : 'password'}
              id='password'
              inputProps={{ maxLength: 20 }}
              autoComplete='current-password'
              size='small'
              onBlur={handleBlur}
              error={errors.passwordError}
              helperText={(errors.passwordError && validation.errorText("Invalid password"))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        // Toggle password visibility
                        setPasswordVisibility((prevState) => !prevState);
                      }}
                      edge='end'
                    >
                      {passwordVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>

            <div style={{ textAlign: 'left', marginBottom: isSmallScreen ? '35px' : '0px' }}>
              <a href="" style={{ color: "GrayText" }} onClick={handleForgetPassword}>
                Forget Password ? Click Here
              </a> <br></br>
              <a href="" style={{ color: 'GrayText' }} onClick={handleFeedbackFormClick}>
                Feedback ? Click Here
              </a>
            </div>
          </Box>
        </Box>
      </Container>
      <CustomAppBar title={copyrightText} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
