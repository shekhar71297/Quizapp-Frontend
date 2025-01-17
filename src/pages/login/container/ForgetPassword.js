import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Get, Put } from '../../../services/Http.Service';
import { userActions } from '../../user/userSliceReducer';
import { urls } from '../../../utils/constant';
import * as validation from '../../../utils/constant';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [foundUser, setFoundUser] = useState(null); // State to store found user
  const [show, setShow] = useState(true)
  const [passwordVisibility, setPasswordVisibility] = useState(false); // State for password visibility
  const [password2Visibility, setPassword2Visibility] = useState(false); // State for password2 visibility
  const dispatch = useDispatch();
  const { allUser } = useSelector((store) => store.user);
  const [errors, setErrors] = useState({
    passwordError: false
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    // initBranchRequest();
    Get(urls.branch)
      .then(response => {
        const reversedexam = response.data.reverse(); // Reverse the array of users
        dispatch(userActions.getBranch(reversedexam));
      })
      .catch(error => console.log("Branch error: ", error));

  }, [])

  useEffect(() => {
    Get(`${urls.user}`)
      .then(response => {
        const reversedUsers = response.data.reverse();
        dispatch(userActions.getUser(reversedUsers));
      })
      .catch(error => console.log("user error: ", error));
  }, []);

  const inputChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const handleClick = () => {
    navigate('/'); // Navigate to the home page
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === 'password') { // Corrected 'Password' to 'password'
      const isPasswordError = !validation.isValidPassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: isPasswordError,

      }));
    }

  };


  const submitBtnHandler = () => {
    const user = allUser.find(user => user.email === email);
    if (user) {
      setFoundUser(user);
      setSnackbarSeverity('success');
      setSnackbarMessage('User found successfully!');
      setShow(false)
    } else {
      setSnackbarSeverity('error');
      setSnackbarMessage('User not found!');
    }
    setIsSnackbarOpen(true);
  };

  const updatePasswordHandler = () => {
    if (!foundUser || !foundUser.id) {
      setSnackbarSeverity('error');
      setSnackbarMessage("User or user ID not found.");
      setIsSnackbarOpen(true);
      return;
    }

    if (password !== password2) {
      setSnackbarSeverity('error');
      setSnackbarMessage("Passwords don't match!");
      setIsSnackbarOpen(true);
      return;
    }

    // Ensure to include the required fields such as branch_id
    let updatedUserData = {
      ...foundUser,
      password: password,
      password2: password2,
      branch_id: foundUser.branch ? foundUser.branch.id : null
    };

    // Update password in the database
    const url = `${urls.password}${foundUser.id}/`;
    Put(url, updatedUserData)
      .then(response => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Password updated successfully!');
        setIsSnackbarOpen(true);
      })
      .catch(error => {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to update password!');
        setIsSnackbarOpen(true);
      });

    setTimeout(() => {
      handleClick()
    }, 1000);
  };

  //---------------Function to toggle password visibility for password field------------------//
  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  //---------------Function to toggle password visibility for password2 field-----------------//
  const togglePassword2Visibility = () => {
    setPassword2Visibility((prevState) => !prevState);
  };
  return (
    <>

      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0px 0px 7px black',
            borderRadius: "10px",
            border: 'none',
            padding: "50px"
          }}
        >
          <LockResetIcon style={{ fontSize: '50px', color: '#2c387e' }} />
          <Typography sx={{ color: 'primary.main', fontSize: isSmallScreen ? '18px' : '20px' }}>
            Forget Password
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Enter Email Id"
              name="email"
              autoFocus
              size='small'
              value={email}
              onChange={inputChangeHandler}
            />
            {show && (
              <>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={submitBtnHandler}
                >
                  Forget Password
                </Button>
              </>
            )}

            {foundUser && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="New Password"
                  name="password"
                  size='small'
                  type={passwordVisibility ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={errors.passwordError}
                  helperText={
                    errors.passwordError ?
                      validation.errorText("Please enter a valid password") :
                      'eg.Abcd@1234'// No helper text when there's no error

                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge='end'
                        >
                          {passwordVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}

                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password2"
                  size='small'
                  label="Confirm Password"
                  name="password2"
                  type={password2Visibility ? 'text' : 'password'}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={togglePassword2Visibility}
                          edge='end'
                        >
                          {password2Visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.passwordError && (
                  <div>
                    <ul style={{ color: '#f44336', textAlign: 'left', paddingLeft: '20px', margin: '5px 0' }}>
                      <li>One lowercase character</li>
                      <li>One uppercase character</li>
                      <li>One number</li>
                      <li>One special character</li>
                      <li>8 characters minimum</li>
                    </ul>
                  </div>
                )}

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={updatePasswordHandler}
                >
                  Update Password
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setIsSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ForgetPassword;
