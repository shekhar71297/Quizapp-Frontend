import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import { InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { MdErrorOutline } from "react-icons/md";
import { AppBar, Toolbar } from '@mui/material';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Menu from '@mui/material/Menu';
import { formatMs, useTheme } from '@material-ui/core/styles';
import * as validation from '../../../utils/constant';
import { userActions } from '../userSliceReducer';
import { Get, Post } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import CustomAppBar from '../../../component/common/CustomAppBar';
import logoimg from '../../../asset/img/Hematite Logo.jpg';
import './form.css';
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    contact: '',
    password: '',
    password2: '',
    gender: '',
    prnNo: '',
    branch: '',
    otherbranch: '',
    role: '',
    organization: ''
  });
  const [selectedBranch, setSelectedBranch] = useState('');

  const [errors, setErrors] = useState({
    fnameError: false,
    lnameError: false,
    emailError: false,
    contactError: false,
    pnrNoError: false,
    passwordError: false,
    password2Error: false,
    matchPasswordError: false,
    otherBranchError: false
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [password2Visibility, setPassword2Visibility] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false)
  const { allBranch } = useSelector((store) => store.user)
  const { allUser } = useSelector((store) => store.user)
  const dispatch = useDispatch();
  const nav = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const [anchorEl, setAnchorEl] = useState(null);
  const copyrightText = `© 2017-${currentYear} Hematite Infotech, All Rights Reserved.`;
  const location = useLocation();
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
    Get(urls.user).then(response => {
      const reversedexam = response.data.reverse(); // Reverse the array of users
      dispatch(userActions.getUser(reversedexam));
    })
      .catch(error => console.log("user error: ", error));
  }, [])

  useEffect(() => {
    if (location.pathname === '/student-registration' || location.pathname === '/employee-registration') {
      setShowLogin(true)
    }
  }, [])
  useEffect(() => {
    if (allBranch && allBranch.length === 1) {
      // Set the branch name and ID when there is only one branch
      const singleBranch = allBranch[0];
      setSelectedBranch(singleBranch.branchName);

      setFormData(prevFormData => ({
        ...prevFormData,
        branch_id: singleBranch.id,
      }));
    }
  }, [allBranch]);

  // A separate effect to update formData after selectedBranch is set
  useEffect(() => {
    const selectedBranchObject = allBranch?.find(branch => branch.branchName === selectedBranch);
    if (selectedBranchObject) {
      setFormData(prevFormData => ({
        ...prevFormData,
        branch_id: selectedBranchObject.id,
      }));
    }
  }, [selectedBranch, allBranch]);

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   if (name === 'selectedBranch') {
  //     setSelectedBranch(value); // Update selectedBranch with the new value
  //     console.log(selectedBranch);
  //     const selectedBranchObject = allBranch.find(branch => branch.id === value);
  //     const branchId = selectedBranchObject ? selectedBranchObject.id : ''; // Get the branch id from the selected branch object
  //     console.log(branchId);

  //     setFormData({
  //       ...formData,
  //       branch_id: branchId, // Update branch_id in formData
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }

  // };

  const handleChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value
    switch (name) {
      case 'fname':
        setFormData({
          ...formData,
          fname: value,

        });
        break;

      case 'lname':
        setFormData({
          ...formData,
          lname: value,

        });
        break;
      case 'email':
        setFormData({
          ...formData,
          email: value,
        });
        break;
      case 'contact':
        setFormData({
          ...formData,
          contact: value,
        });
        break;
      case 'password':
        setFormData({
          ...formData,
          password: value,

        });
        break;
      case 'password2':
        setFormData({
          ...formData,
          password2: value,
        });
        break;
      case 'gender':
        setFormData({
          ...formData,
          gender: value,
        });
        break;
      case 'prnNo':
        setFormData({
          ...formData,
          prnNo: value,
        });
        break;
        case 'branch':
          setFormData((prevFormData) => ({
            ...prevFormData,
            branch: value, // Always update branch value
          }));
        
          if (name === 'branch' && value === 'Branch') {
            setFormData((prevFormData) => ({
              ...prevFormData,
              prnNo: null,
              otherbranch: '',
              organization: 'Hematite branch',
            }));
            setErrors((prevErrors) => ({
              ...prevErrors,
              otherBranchError: false,
              pnrNoError: false,
            }));
          }
        
          if (name === 'branch' && value === 'cdac') {
            setFormData((prevFormData) => ({
              ...prevFormData,
              branch: 'cdac',
              branch_id: null,
              otherbranch: '',
              organization: 'Cdac',
            }));
            setErrors((prevErrors) => ({
              ...prevErrors,
              otherBranchError: false,
            }));
          }
        
          if (name === 'branch' && value === 'otherbranch') {
            setFormData((prevFormData) => ({
              ...prevFormData,
              branch: 'otherbranch',
              branch_id: null,
              prnNo: null,
              organization: 'Other branch',
            }));
            setErrors((prevErrors) => ({
              ...prevErrors,
              pnrNoError: false,
            }));
          }
        
          break;
        
      case 'role':
        setFormData({
          ...formData,
          role: value,
        });
        break;
      case 'organization':
        setFormData({
          ...formData,
          organization: value
        });
        break;
      case 'otherbranch':
        setFormData({
          ...formData,
          otherbranch: value,

        });
        break;
      default:
    }


  }


  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'fname' || name === 'lname') {
      const isNameError = !validation.isValidName(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}Error`]: isNameError,
      }));
    }

    if (name === 'email') {
      const isEmailError = !validation.isValidEmail(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailError: isEmailError,
      }));
    }

    if (name === 'contact') {
      const isContactError = !validation.isValidContact(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactError: isContactError,
      }));
    }

    if (name === 'prnNo') {
      const ispnrNoError = !validation.isValidPnr(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        pnrNoError: ispnrNoError,
      }));
    }


    if (name === 'otherbranch') {
      const isOtherBranchError = !validation.isValidOtherBranch(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherBranchError: isOtherBranchError,
      }));
    }

    if (name === 'password') { // Corrected 'Password' to 'password'
      const isPasswordError = !validation.isValidPassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: isPasswordError,

      }));
    }

    if (name === 'password2') { // Corrected 'Password' to 'password'
      const isPasswordError = !validation.isValidPassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password2Error: isPasswordError,

      }));
    }
    if (formData.password !== '' && formData.password2 !== '') {
      if (formData.password !== formData.password2) { // CheckPassword
        setErrors((prevErrors) => ({
          ...prevErrors,
          matchPasswordError: true,

        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          matchPasswordError: false,

        }));
      }
    }

    if (name === 'branch' && value === 'Branch') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        prnNo: null,
        otherbranch: '',
        organization: 'Hematite branch'
      }));
      setErrors({
        ...errors,
        otherBranchError: false,
        pnrNoError: false
      })
    }
    if (name === 'branch') {
      const selectedBranchObject = allBranch.find(branchObj => branchObj.branchName === value);
      if (selectedBranchObject) {
        setFormData(prevFormData => ({
          ...prevFormData,
          branch_id: selectedBranchObject.id,
          // Other necessary updates
        }));
      }
    }


    if (name === 'branch' && value === 'cdac') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        branch: 'cdac',
        branch_id: null,
        otherbranch: '',
        organization: 'Cdac'
      }));
      setErrors({
        ...errors,
        otherBranchError: false
      })
    }

    if (name === 'branch' && value === 'otherbranch') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        branch: 'otherbranch',
        branch_id: null,
        prnNo: null,
        organization: 'Other branch'
        // otherbranch: '',
      }));
      setErrors({
        ...errors,
        pnrNoError: false
      })

    }

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userExists = allUser.some(emp => emp.email === formData.email);
    if (userExists) {
      setSnackbarOpen(true);
      setSeverity('error');
      setSnackbarMessage('User already exists.');
      return;
    }
    if (formData.password !== formData.password2) {
      setFormData((prevState) => ({
        ...prevState,
        snackbarOpen: true,
        snackbarMessage: 'Passwords do not match.',
        severity: 'warning',
      }));
      return; // Return early if passwords don't match
    }


    if (
      errors.fnameError ||
      errors.lnameError ||
      errors.emailError ||
      errors.contactError ||
      errors.pnrNoError ||
      errors.passwordError ||
      errors.password2Error ||
      errors.otherBranchError ||
      errors.matchPasswordError
    ) {
      setSnackbarOpen(true);
      setSeverity('error');
      setSnackbarMessage('Please fix the validation errors before submitting.');
      return;
    }

    if (branch == 'otherbranch' && otherbranch == '') {
      setSnackbarOpen(true);
      setSeverity('error');
      setSnackbarMessage('Please enter other branch.');
      return;
    }
    if (branch == 'cdac' && (prnNo == '' || prnNo == null)) {

      setSnackbarOpen(true);
      setSeverity('error');
      setSnackbarMessage('Please enter PNR No.');
      return;
    }
    const updatedFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
      fname: formData.fname.toLowerCase(),
      lname: formData.lname.toLowerCase(),
    };
    console.log(updatedFormData);

    // Dispatch add student action
    // addStudentRequest(formData);
    Post(urls.student, updatedFormData)
      .then(response => {
        console.log(response);
        if (response?.status === 201 || response?.status === 200) {
          dispatch(userActions.addUser(response.data));
          // Show success snackbar
          setSnackbarOpen(true);
          setSeverity('success');
          setSnackbarMessage('Student Registered Successfully');
        }
      })
      .catch(error => {
        console.log(error);
        
        setSnackbarOpen(true);
        setSeverity('error');
        setSnackbarMessage(`${error?.name}:${error?.message}`)
      });

    // Clear form data
    setFormData({
      fname: '',
      lname: '',
      email: '',
      contact: '',
      password: '',
      password2: '',
      gender: '',
      prnNo: '',
      branch: '',
      otherbranch: '',
      role: '',
      branch_id: '',// Reset branch_id
      organization: ''
    });

    setTimeout(() => {
      nav('/'); // Navigate to login page after a delay
    }, 3000); // Adjust the delay time as needed
  };


  const resetFormHandler = () => {
    setFormData((prevState) => ({
      ...prevState,
      fname: '',
      lname: '',
      email: '',
      contact: '',
      password: '',
      password2: '',
      gender: '',
      prnNo: '',
      branch: '',
      otherbranch: '',
      role: '',
      branch_id: '',
      organization: ''
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



  const { fname, lname, email, contact, gender, role, prnNo, branch, otherbranch, password, password2, organization } = formData;
  const isSubmitDisabled = !fname || !lname || !email || !contact || !gender || !password || !organization || !branch || errors.fnameError ||
    errors.lnameError || errors.emailError || errors.contactError || errors.passwordError || errors.otherBranchError || errors.pnrNoError || errors.password2Error || errors.matchPasswordError;

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
                marginTop: '3px',
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

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: "600px",
              margin: "auto",
              padding: "10px"
            }}>
              <div>
                <Typography sx={{
                  fontSize: isSmallScreen ? '20px' : '25px', color: 'primary.main' // Adjust font size based on screen size
                }} variant="h4" gutterBottom >
                  Student Registration
                </Typography>
                <form onSubmit={handleSubmit} >
                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'}>
                    <TextField
                      type="text"
                      variant='outlined'
                      color='primary'
                      label={<span>First Name <span style={{ color: 'red' }}>*</span></span>}  // Add asterisk
                      // onChange={(e) => handleChange(e)}
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      value={fname}
                      name='fname'
                      fullWidth
                      inputProps={{ maxLength: 20 }}
                      size='small'
                      error={errors.fnameError}
                      helperText={(errors.fnameError && validation.errorText("Enter valid first name"))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px', // Adjust label font size based on screen size
                        },
                      }}
                    />

                    <TextField
                      type="text"
                      variant='outlined'
                      color='primary'
                      label={<span>Last Name <span style={{ color: 'red' }}>*</span></span>}  // Add asterisk
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      value={lname}
                      name='lname'
                      fullWidth
                      inputProps={{ maxLength: 20 }}
                      size='small'
                      error={errors.lnameError}
                      helperText={(errors.lnameError && validation.errorText("Enter valid last name"))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px',
                        },
                      }}
                    />
                  </Stack>

                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{ marginTop: '20px' }}>
                    <TextField
                      type="email"
                      variant='outlined'
                      color='primary'
                      label={<span>Email <span style={{ color: 'red' }}>*</span></span>}  // Add asterisk
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      value={email}
                      name='email'
                      fullWidth
                      size='small'
                      inputProps={{ maxLength: 30 }}
                      sx={{ mb: 4 }}
                      error={errors.emailError}
                      helperText={(errors.emailError && validation.errorText("Enter valid email id"))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px',
                        },
                      }}
                    />

                    <TextField
                      type="tel"
                      variant='outlined'
                      color='primary'
                      label={<span>Contact Number <span style={{ color: 'red' }}>*</span></span>}  // Add asterisk
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      value={contact}
                      name='contact'
                      fullWidth
                      size='small'
                      inputProps={{ maxLength: 10 }}
                      sx={{ mb: 4 }}
                      error={errors.contactError}
                      helperText={(errors.contactError && validation.errorText("Enter valid contact number"))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px',
                        },
                      }}
                    />
                  </Stack>

                  <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} sx={{ marginTop: '20px' }}>
                    <TextField
                      type={passwordVisibility ? 'text' : 'password'}
                      variant='outlined'
                      color='primary'
                      label={<span>Password <span style={{ color: 'red' }}>*</span></span>}  // Add asterisk
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      value={password}
                      name='password'
                      fullWidth
                      size='small'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setPasswordVisibility(prevState => !prevState)} edge='end'>
                              {passwordVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{ maxLength: 20 }}
                      sx={{ mb: 4 }}
                      error={errors.passwordError}
                      helperText={(errors.passwordError && validation.errorText("Enter valid password"))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px',
                        },
                      }}
                    />

                    <TextField
                      type={password2Visibility ? 'text' : 'password'}
                      variant='outlined'
                      color='primary'
                      label={<span>Confirm Password <span style={{ color: 'red' }}>*</span></span>}  // Add asterisk
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      value={password2}
                      name='password2'
                      fullWidth
                      size='small'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setPassword2Visibility(prevState => !prevState)} edge='end'>
                              {password2Visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{ maxLength: 14 }}
                      sx={{ mb: 4 }}
                      error={errors.matchPasswordError}
                      helperText={(errors.matchPasswordError && validation.errorText("Password and Confirm Password doesn't match"))}
                      InputLabelProps={{
                        style: {
                          fontSize: isSmallScreen ? '12px' : '16px',
                        },
                      }}
                    />
                  </Stack>

                  {errors.passwordError && (
                    <div>
                      <ul style={{ color: '#f44336', textAlign: 'left', paddingLeft: '20px', margin: '5px 0' }}>
                        <li>One lowercase character</li>
                        <li>One uppercase character</li>
                        <li>One number</li>
                        <li>One special character</li>
                        <li>8 characters minimum</li>
                        <li>Your password must be between 8 and 14 characters long</li>
                      </ul>
                    </div>
                  )}


                  <FormControl fullWidth size='small' sx={{ marginTop: '20px' }}>
                    <InputLabel
                      sx={{ fontSize: isSmallScreen ? '12px' : '16px' }}
                      id="demo-simple-select-autowidth-label"
                    >
                      Select Role <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth-label"
                      name='role'
                      value={role}
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      autoWidth
                      label="Select Role"
                      required
                      color='primary'
                    >
                      <MenuItem value='' aria-label='Choose role'>Select Role</MenuItem>
                      <MenuItem value='student'>Student</MenuItem>
                      <MenuItem value='intern'>Intern</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <p style={{ textAlign: 'left', fontWeight: 'bold', fontSize: isSmallScreen ? '14px' : '16px' }}>
                      Select Branch <span style={{ color: 'red' }}>*</span>
                    </p>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="branch"
                      value={branch || " "}
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                    >
                      <FormControlLabel value="Branch" control={<Radio />} label="Hematite Branch" />
                      <FormControlLabel value="cdac" control={<Radio />} label="CDAC" />
                      <FormControlLabel value="otherbranch" control={<Radio />} label="Other" />
                    </RadioGroup>
                    {branch === 'Branch' && (allBranch && allBranch.length > 1 ? (
                      <FormControl fullWidth size='small'>
                        <InputLabel sx={{ fontSize: isSmallScreen ? '12px' : '16px' }} id="demo-simple-select-autowidth-label">
                          Select Branch <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth-label"
                          name='selectedBranch'
                          value={selectedBranch}
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                          aria-label='Choose branch'
                          autoWidth
                          label='Select Branch'
                          color='primary'
                        >
                          <MenuItem value='' aria-label='Choose branch'>Select Branch</MenuItem>
                          {allBranch.map((val) => (
                            <MenuItem key={val.id} value={val.id}>{capitalizeFirstLetter(val.branchName)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      (() => {
                        // Directly set the value if only one branch exists
                        if (allBranch && allBranch.length === 1 && selectedBranch !== allBranch[0].id) {
                          handleChange({ target: { name: 'selectedBranch', value: allBranch[0].id } });
                        }
                        return null; // Do not render TextField
                      })()
                    ))}



                    {branch === 'cdac' && (
                      <TextField
                        id="prnNo"
                        variant="outlined"
                        color="primary"
                        label="PRN No"
                        name="prnNo"
                        value={prnNo}
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        inputProps={{ maxLength: 20 }}
                        error={errors.pnrNoError}
                        helperText={(errors.pnrNoError && validation.errorText("Enter valid PRN-No"))}
                        fullWidth
                        size='small'
                      />
                    )}

                    {branch === 'otherbranch' && (
                      <TextField
                        id="otherbranch"
                        variant="outlined"
                        color="primary"
                        label="Other Branch"
                        name="otherbranch"
                        value={otherbranch}
                        inputProps={{ maxLength: 30 }}
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        fullWidth
                        size='small'
                        error={errors.otherBranchError}
                        helperText={(errors.otherBranchError && validation.errorText("Enter valid other branch"))}
                      />
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <p style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '14px' : '16px', textAlign: 'left' }}>
                      Select Gender <span style={{ color: 'red' }}>*</span>
                    </p>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={gender || " "}
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      sx={{ mb: 4 }}
                      row
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>


                  <Stack spacing={2} direction="row" sx={{ marginTop: '8px', display: 'flex', flexDirection: 'row' }}>
                    <Button variant="contained" color="primary" type="submit" size='small' disabled={isSubmitDisabled}>Submit</Button>
                    <Button type="button" size='small' onClick={() => resetFormHandler()} variant="contained" color="primary">Clear</Button>
                  </Stack>
                </form>

              </div>
            </Box>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={() => setSnackbarOpen(false)}
                severity={severity}
              >
                {snackbarMessage}
              </MuiAlert>
            </Snackbar>
            <CustomAppBar title={copyrightText} />
          </Box>
        </Paper>
      </Container>
    </>
  );
};


export default RegistrationForm;
