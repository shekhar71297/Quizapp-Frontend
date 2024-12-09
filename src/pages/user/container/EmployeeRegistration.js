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
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';


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
      empIdError: false,
      fnameError: false,
      lnameError: false,
      emailError: false,
      contactError: false,
      pnrError: false,
      passwordError: false,
      password2Error: false,
      employeeIdError: false,
      matchPasswordError: false
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
          snackbarMessage: 'Employee located successfully',
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


  const handleChange = (e) => {
    // const { name, value } = event.target;
    const name = e?.target?.name;
    const value = e?.target?.value
    if (name === 'employeeId') {
      setState(prevState => ({
        ...prevState,
        [name]: value,
        errors: { ...prevState.errors, employeeIdError: !validation.isValidEmpId(value) }
      }));
      return;
    }


    switch (name) {
      case 'employeeId':
        setState({
          ...state,
          fname: value
        })
        break;

      case 'fname':
        setState({
          ...state,
          fname: value
        })
        break;

      case 'lname':
        setState({
          ...state,
          lname: value

        })
        break;
      case 'email':
        setState({
          ...state,
          email: value


        })
        break;
      case 'contact':
        setState({
          ...state,
          contact: value
        })
        break;
      case 'dob':
        setState({
          ...state,
          fname: value
        })
        break;
      case 'password':
        setState({
          ...state,
          password: value
        })
        break;
      case 'password2':
        setState({
          ...state,
          password2: value
        })
        break;
      case 'gender':
        setState({
          ...state,
          gender: value

        })
        break;

      case 'role':
        setState({
          ...state,
          role: value

        })
        break;


      default:
        break;
    }
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
    if (password !== '' && password2 !== '') {
      if (password !== password2) { // CheckPassword
        setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, matchPasswordError: true },
        }))
      } else {
        setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, matchPasswordError: false },
        }))
      }
    }


  };

  const handleFieldChange = (event) => {
    const { name } = event.target;
  
    // Only trigger findEmployeeById when the employeeId field is blurred
    if (name === 'employeeId') {
      findEmployeeById(event.target.value);  // Validate Employee ID when it loses focus
    }
  
    handleChange(event);  // Call handleChange to handle regular state updates
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
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            snackbarOpen: true,
            snackbarMessage: 'Employee registered.',
            severity: 'success',
          }));
          dispatch(userActions.addUser(response.data))
        }


      })
      .catch(error => {
        setState((prevState) => ({
          ...prevState,
          snackbarOpen: true,
          snackbarMessage: error.message,
          severity: 'error',
        }));
      })




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
      errors: {
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              id="basic-menu"
              aria-controls={anchorEl ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              onClick={navigateToBack}
              variant="outlined"
              size='small'
              sx={{
                color: '#FFFFFF',
                marginTop: '3px',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: '#FFFFFF', // Specify same color for hover state

                }
              }}
            >
              Login
            </Button>
            <Typography sx={{}} variant="h6" noWrap component="div">
              |
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
          </div>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="sm" sx={{ marginTop: '3rem' }}>
        <Paper variant="outlined" sx={{ padding: '2rem', minHeight: isSmallScreen ? '920px' : '400px', marginBottom: '70px' }}>

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
                    label={<span>Enter employee id<span style={{ color: 'red' }}>*</span></span>}
                    onChange={(e) => handleChange(e)}
                    value={employeeId}
                    name="employeeId"
                    fullWidth
                    size='small'
                    inputProps={{ maxLength: 3 }}
                    onBlur={handleFieldChange}
                    helperText={(state.errors.employeeIdError && validation.errorText('Enter valid employee id'))}
                    error={state.errors.employeeIdError}
                    InputLabelProps={{
                      style: {
                        fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                        // Add more label styles here
                      },
                    }}
                  />
                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{ marginTop: '20px' }}>
                    <TextField
                      type="text"
                      variant="outlined"
                      color="primary"
                      label="First Name"
                      onChange={(e) => handleChange(e)}
                      value={fname}
                      name="fname"
                      fullWidth
                      required
                      size='small'
                      disabled={!isFieldsEnabled}
                      InputProps={{ readOnly: true }}
                      error={state.errors.fnameError}
                      helperText={(state.errors.fnameError && validation.errorText('Enter valid first name'))}
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
                      onChange={(e) => handleChange(e)}
                      value={lname}
                      name="lname"
                      fullWidth
                      required
                      size='small'
                      disabled={!isFieldsEnabled}
                      InputProps={{ readOnly: true }}
                      error={state.errors.lnameError}
                      helperText={(state.errors.lnameError && validation.errorText('Enter valid last name'))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                          // Add more label styles here
                        },
                      }}
                    />
                  </Stack>

                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{ marginTop: '20px' }}>
                    <TextField
                      type="email"
                      variant="outlined"
                      color="primary"
                      label="Email"
                      onChange={(e) => handleChange(e)}
                      value={email}
                      name="email"
                      fullWidth
                      required
                      size='small'
                      disabled={!isFieldsEnabled}
                      InputProps={{ readOnly: true }}
                      error={state.errors.emailError}
                      helperText={(state.errors.emailError && validation.errorText('Enter valid email'))}
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
                      label="Contact Number"
                      onChange={(e) => handleChange(e)}
                      value={contact}
                      name="contact"
                      fullWidth
                      required
                      size='small'
                      disabled={!isFieldsEnabled}
                      InputProps={{ readOnly: true }}
                      error={state.errors.contactError}
                      helperText={(state.errors.contactError && validation.errorText('Enter valid contact number'))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                          // Add more label styles here
                        },
                      }}
                    />
                  </Stack>

                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{ marginTop: '20px' }}>
                    <TextField
                      type={passwordVisibility ? 'text' : 'password'} // Toggle password visibility
                      variant="outlined"
                      color="primary"
                      label={<span>Password <span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => handleChange(e)}
                      value={password}
                      name="password"
                      onBlur={handleBlur}
                      fullWidth

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
                      helperText={(state.errors.passwordError && validation.errorText('Enter valid password'))}
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
                      label={<span>Confirm Password <span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => handleChange(e)}
                      value={password2}
                      name="password2"
                      size='small'
                      onBlur={handleBlur}
                      disabled={!isFieldsEnabled}
                      error={state.errors.matchPasswordError}
                      helperText={(state.errors.matchPasswordError && validation.errorText("Password and Confirm Password does't match"))}
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

                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                          // Add more label styles here
                        },
                      }}
                    />
                  </Stack>

                  {state.errors.passwordError && (
                    <div>
                      <ul style={{ color: '#f44336', textAlign: 'left', paddingLeft: '20px', margin: '5px 0' }}>
                        <li>One lowercase character</li>
                        <li>One uppercase character</li>
                        <li>One number</li>
                        <li>One special character</li>
                        <li>Your password must be between 8 and 14 characters long</li>
                      </ul>
                    </div>
                  )}

                  <FormControl fullWidth aria-readonly>
                    <p style={{ textAlign: 'left' }} >Select Gender</p>
                    <RadioGroup aria-label="gender" name="gender" value={gender || ' '} aria-readonly row>
                      <FormControlLabel aria-readonly value="male" control={<Radio />} label="Male" />
                      <FormControlLabel aria-readonly value="female" control={<Radio />} label="Female" />
                      <FormControlLabel aria-readonly value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>

                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} marginTop={3}>
                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="Role"
                      onChange={(e) => handleChange(e)}
                      value={capitalizeFirstLetter(role)}
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
                      onChange={(e) => handleChange(e)}
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

                  <Stack spacing={2} direction="row" sx={{ marginTop: '20px' }}>
                    <Button variant="contained" size='small' color="primary" type="submit" disabled={isSubmitDisabled}>
                      Submit
                    </Button>
                    <Button type="button" size='small' onClick={resetStudentFormHandler} variant="contained" color="primary">
                      Clear
                    </Button>
                  </Stack>
                  {/* <div style={{ display: 'flex', flexDirection: 'row', marginTop: '25px', justifyContent: 'left' }} >
              <a href="" style={{ color: "GrayText" }} onClick={(e) => navigateToBack(e)}>
                Login ? Click Here
              </a> <br></br>
            </div> */}
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
