import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import { Link } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AppBar, Toolbar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { userActions } from '../userSliceReducer';
import { staffActions } from '../../Staff/staffSliceReducer';
import { Get, Post } from '../../../services/Http.Service';
import CustomAppBar from '../../../component/common/CustomAppBar';
import { urls } from '../../../utils/constant';
import * as validation from '../../../utils/constant';
import logoimg from '../../../asset/img/Hematite Logo.jpg'


function EmployeeRegistration() {
  const { allEmployee } = useSelector((store) => store.employee)
  const { allUser } = useSelector((store) => store.user)
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [password2Visibility, setPassword2Visibility] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const copyrightText = `© 2017-${currentYear} Hematite Infotech, All Rights Reserved.`;
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState({
    students: [],
    id: null,
    fname: '',
    lname: '',
    email: '',
    contact: '',
    dob: '',
    password: '',
    password2: '',
    gender: '',
    role: '',
    term: false,
    open: false,
    isAddStudent: true,
    isDeletePopupOpen: false,
    deletingRecordId: null,
    isDetailsPopupOpen: false,
    selectedRecord: '',
    snackbarOpen: false,
    snackbarMessage: '',
    severity: '',
    isFieldsEnabled: false,
    errors: {
      fnameError: false,
      lnameError: false,
      emailError: false,
      contactError: false,
      pnrError: false,
      passwordError: false,
      password2Error: false,
      employeeIdError: false
    },
  });


  useEffect(() => {
    Get(urls.employee).then(response => {
      const reversedexam = response.data.reverse(); // Reverse the array of users
      dispatch(staffActions.getEmployee(reversedexam));
    })
      .catch(error => console.log("user error: ", error));
  }, [])

  useEffect(() => {
    Get(urls.user).then(response => {

      const reversedexam = response.data.reverse(); // Reverse the array of users
      dispatch(userActions.getUser(reversedexam));
    })
      .catch(error => console.log("user error: ", error));
  }, [])


 
  const findEmployeeById = (employeeId) => {
    const EmpID = parseInt(employeeId);
    const employee = allEmployee.find((emp) => emp.employeeId === EmpID);
    if (employee) {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          snackbarOpen: true,
          variant: 'filled',
          snackbarMessage: 'Employee found successfully',
          severity: 'success',
        }));
      }, 500)
      setState((prevState) => ({
        ...prevState,
        ...employee,
        isFieldsEnabled: true, // Enable fields for editing
      }));
    } else {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          snackbarOpen: true,
          variant: 'filled',
          snackbarMessage: 'Employee not found',
          severity: 'error',
        }));
      }, 500)

      resetStudentFormHandler()
      setState((prevState) => ({
        ...prevState,
        isFieldsEnabled: false, // Disable all fields
      }));
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'password') { // Corrected 'Password' to 'password'
      const isPasswordError = !validation.isValidPassword(value);
      setState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, passwordError: isPasswordError },
      }));
    }
    if (name === 'password2') { // Corrected 'Password' to 'password'
      const isPasswordError = !validation.isValidPassword(value);
      setState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, password2Error: isPasswordError },
      }));
    }
    

    if (name === 'employeeId') {
      if (!Number.isInteger(Number(value))) {
        setState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            employeeIdError: true,
          },
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            employeeIdError: false, // Clear the error state for employeeId field
          },
        }));
      }
      return;
    }
  };

  const handleFieldChange = (event) => {
    // Call handleBlur function
    handleBlur(event);
    // Call handleChange function
    handleChange(event);
    // Call findEmployeeById when employee ID field loses focus
    findEmployeeById(event.target.value);
  };

  const addRegisterStaff = (event) => {
    event.preventDefault();
    if (state.password !== state.password2) {
      setState((prevState) => ({
        ...prevState,
        snackbarOpen: true,
        snackbarMessage: 'Passwords do not match.',
        severity: 'warning',
      }));
      return; // Return early if passwords don't match
    }

    const userExists = allUser.some(emp => emp.email === state.email);
    if (userExists) {
      setState((prevState) => ({
        ...prevState,
        snackbarOpen: true,
        snackbarMessage: 'User already exists.',
        severity: 'error',
      }));
      return; // Return early if the user already exists
    }


    if (state.errors.passwordError || state.errors.password2Error || state.errors.employeeIdError) {
      setState((prevState) => ({
        ...prevState,
        snackbarOpen: true,
        variant: 'filled',
        snackbarMessage: 'Please fix the validation errors before submitting.',
        severity: 'error',
      }));
      return;
    }

    // Assuming successful registration here


    // Reset the form fields
    setState((prevState) => ({
      ...prevState,
      students: [],
      fname: '',
      lname: '',
      email: '',
      contact: '',
      password: '',
      password2: '',
      gender: '',
      role: '',
      dob: '',
      employeeId: '',
      organization: '',
      term: false,
      branch: '',
      pnr: '',
      otherBranch: '',
      isAddStudent: true,
      isDeletePopupOpen: false,
      deletingRecordId: null,
      isDetailsPopupOpen: false,
      snackbarOpen: false,
      snackbarMessage: '',
      severity: 'success',
    }));

    const payload = {
      fname: state.fname,
      lname: state.lname,
      email: state.email,
      contact: state.contact,
      password: state.password,
      password2: state.password2,
      gender: state.gender,
      dob: state.dob,
      role: state.role,
      employeeId: state.employeeId,
    };
    Post(urls.staff, payload)
      .then(response => dispatch(userActions.addUser(response.data)))
      .catch(error => console.log("user error: ", error))


    setState((prevState) => ({
      ...prevState,
      snackbarOpen: true,
      snackbarMessage: 'User successfully registered.',
      severity: 'success',
    }));

    setTimeout(() => {
      nav('/')
    }, 2000);
  };


  const resetStudentFormHandler = () => {
    setState((prevState) => ({
      ...prevState,
      fname: '',
      lname: '',
      email: '',
      contact: '',
      password: '',
      password2: '',
      gender: '',
      dob: '',
      role: '',
      employeeId: '',
      isFieldsEnabled: false,
      errors:{
        fnameError: false,
        lnameError: false,
        emailError: false,
        contactError: false,
        pnrError: false,
        passwordError: false,
        password2Error: false,
        employeeIdError: false
      }
    }));
  };

  const navigateToBack = (e) => {
    e.preventDefault()
    nav('/')
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStudent = () => {
  
    nav('/student-registration')
    handleClose();
  };

  const handleEmployee = () => {
    
    nav('/employee-registration')
    handleClose();
  };




  const { fname, lname, email, contact, password, password2, gender, dob, role, errors, employeeId, isFieldsEnabled } = state;
  const isSubmitDisabled = !fname || !lname || !email || !contact || !password || !password2 || !gender || !role || !employeeId || !dob || errors.passwordError || errors.password2Error;


  return (
    <>
   <AppBar color='primary' position="sticky">
        <Toolbar >
        <div style={{ display: 'flex', marginRight: '10px' }} >
            <img style={isSmallScreen ? { width: "40px", height: "35px", borderRadius: "64%", boxShadow: "white 0px 0px 6px -1px" } : { width: "50px", height: "46px", borderRadius: "64%", boxShadow: "white 0px 0px 6px -1px" }} src={logoimg} alt="logoimg" />
          </div>
          <Typography component="div" sx={{ flexGrow: 1 }} style={{ textAlign: 'left', width: '90px' }}>
            {isSmallScreen ? 'Hematite Infotech ' : 'Hematite Infotech Online-Quiz'}
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

      <Container component="main" maxWidth="sm" sx={{ marginTop: '3rem' }}>
        <Paper variant="outlined" sx={{ padding: '2rem', minHeight: isSmallScreen ? '920px' : '400px',marginBottom:'70px' }}>
       
    <Box sx={{ flexGrow: 1 }}>

      <Box
        sx={{
          // marginTop: 13,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '600px',
          margin: 'auto',
          padding: '10px',
        }}
      >
        <div>

          <Typography sx={{
            fontSize: isSmallScreen ? '20px' : '25px', color: 'primary.main' // Adjust font size based on screen size
          }} variant="h4" gutterBottom >
            Employee Registration
          </Typography>

          <form onSubmit={addRegisterStaff} action={<Link to="" />}>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Enter Employee ID "
              onChange={handleChange}
              value={employeeId}
              name="employeeId"
              fullWidth
              required
              size='small'
              onBlur={handleFieldChange}
              helperText={(state.errors.employeeIdError && validation.errorText('Please enter a valid employee id')) || 'eg:101'}
              error={state.errors.employeeIdError}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                  // Add more label styles here
                },
              }}
            />
            <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{marginTop:'10px'}}>
              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="First Name"
                onChange={handleChange}
                value={fname}
                name="fname"
                fullWidth
                required
                size='small'
                disabled={!isFieldsEnabled}
                InputProps={{ readOnly: true }}
                error={state.errors.fnameError}
                helperText={(state.errors.fnameError && validation.errorText('Please enter a valid fname')) || 'eg:John'}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="Last Name"
                onChange={handleChange}
                value={lname}
                name="lname"
                fullWidth
                required
                size='small'
                disabled={!isFieldsEnabled}
                InputProps={{ readOnly: true }}
                error={state.errors.lnameError}
                helperText={(state.errors.lnameError && validation.errorText('Please enter a valid last name')) || 'eg: Doe'}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
            </Stack>

            <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{marginTop:'10px'}}>
              <TextField
                type="email"
                variant="outlined"
                color="primary"
                label="Email"
                onChange={handleChange}
                value={email}
                name="email"
                fullWidth
                required
                size='small'
                disabled={!isFieldsEnabled}
                InputProps={{ readOnly: true }}
                error={state.errors.emailError}
                helperText={(state.errors.emailError && validation.errorText('Please enter a valid email')) || 'eg:jhon@gmail.com'}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
              <TextField
                type="tel"
                variant="outlined"
                color="primary"
                label="+91 Contact Number"
                onChange={handleChange}
                value={contact}
                name="contact"
                fullWidth
                required
                size='small'
                disabled={!isFieldsEnabled}
                InputProps={{ readOnly: true }}
                error={state.errors.contactError}
                helperText={(state.errors.contactError && validation.errorText('Please enter a valid contact')) || 'eg:9999999999'}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
            </Stack>
       
            <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{marginTop:'10px'}}>
              <TextField
                type={passwordVisibility ? 'text' : 'password'} // Toggle password visibility
                variant="outlined"
                color="primary"
                label="Password"
                onChange={handleChange}
                value={password}
                name="password"
                onBlur={handleBlur}
                fullWidth
                required
                size='small'
                disabled={!isFieldsEnabled}
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

                error={state.errors.passwordError}
                helperText={(state.errors.passwordError && validation.errorText('Please enter a valid password')) || 'eg:Jhon@1234'}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
              <TextField
                type={password2Visibility ? 'text' : 'password'} // Toggle password visibility
                variant="outlined"
                color="primary"
                label="Confirm Password"
                onChange={handleChange}
                value={password2}
                name="password2"
                size='small'
                onBlur={handleBlur}
                disabled={!isFieldsEnabled}
                error={state.errors.password2Error}
                helperText={(state.errors.password2Error && validation.errorText('Please enter a valid password')) || 'eg:Jhon@1234'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => {
                          // Toggle password visibility
                          setPassword2Visibility((prevState) => !prevState);
                        }}
                        edge='end'
                      >
                        {password2Visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
            </Stack>

            {state.errors.passwordError || state.errors.password2Error && (
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
 
            <FormControl fullWidth disabled={!isFieldsEnabled}   >
              <p style={{ textAlign: 'left' }} >Select Gender</p>
              <RadioGroup aria-label="gender" name="gender" value={gender || ' '} onChange={handleChange} row>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>

            <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} marginTop={3}>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Role"
                onChange={handleChange}
                value={role}
                name="role"
                fullWidth
                required
                size='small'
                InputProps={{ readOnly: true }}
                disabled={!isFieldsEnabled}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}
              />
              <TextField
                // type="date"
                variant="outlined"
                color="secondary"
                onChange={handleChange}
                value={dob}
                name="dob"
                label='DOB'
                fullWidth
                size='small'
                required
                InputProps={{ readOnly: true }}
                disabled={!isFieldsEnabled}
                InputLabelProps={{
                  style: {
                    fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                    // Add more label styles here
                  },
                }}

              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ marginTop: '10px' }}>
              <Button variant="contained" size='small' color="primary" type="submit" disabled={isSubmitDisabled}>
                Submit
              </Button>
              <Button type="button" size='small' onClick={resetStudentFormHandler} variant="contained" color="primary">
                Clear
              </Button>
            </Stack>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '25px', justifyContent: 'left' }} >
              <a href="" style={{ color: "GrayText" }} onClick={(e) => navigateToBack(e)}>
                Login ? Click Here
              </a> <br></br>
            </div>
          </form>
        </div>
      </Box>
      <Snackbar open={state.snackbarOpen} autoHideDuration={4000} onClose={() => setState((prevState) => ({ ...prevState, snackbarOpen: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setState((prevState) => ({ ...prevState, snackbarOpen: false }))} severity={state.severity}>
          {state.snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <CustomAppBar title={copyrightText} />
    </Box>
    </Paper>
      </Container>
    </>
  );
}

export default EmployeeRegistration;
