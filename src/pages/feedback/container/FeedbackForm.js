import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Grid, Paper, Typography, Radio, RadioGroup, FormControlLabel, FormControl,
  Select, MenuItem, Snackbar, Alert, InputLabel
} from '@mui/material';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as validation from '../../../utils/constant';
import { Get, Post } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { feedbackActions } from '../feedbackSliceReducer';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';

// FeedbackForm component
const FeedbackForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { allBranch } = useSelector((store) => store.feedback,
  );
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // State to manage form data and errors
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    contact: '',
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    cidacPrn: '',
    otherbranch: '',
    organization: '',
    datetime: new Date().toISOString().split('T')[0],

  });

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    contactError: false,
    questionError: false,
    questionError2: false,
    pnrNoError: false,
    otherBranchError: false,
    questionError3: false,
    questionError4: false,
    questionError5: false,
  });

  // State to manage snackbar for displaying messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    Get(urls.branch).then(response => dispatch(feedbackActions.getBranch(response.data))).catch((error) => {
      console.error('Error fetching feedback:', error);
    })
  }, []);

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (allBranch && allBranch.length === 1) {
      setSelectedBranch(allBranch[0].branchName);
      const selectedBranchObject = allBranch.find(branch => branch.branchName === selectedBranch);
      const branchId = selectedBranchObject ? selectedBranchObject.id : ''; // Get the branch id from the selected branch object
      setFormData({
        ...formData,
        branch_id: branchId, // Update branch_id in formData
      });
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
  //----------------------------Function to handle changes in form fields----------------------//
  const handleChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value
   
    

    switch (name) {
      case 'name':
        setFormData({
          ...formData,
          name: value,

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

      case 'question1':
        setFormData({
          ...formData,
          question1: value,

        });
        break;
      case 'question2':
        setFormData({
          ...formData,
          question2: value,
        });
        break;
      case 'question3':
        setFormData({
          ...formData,
          question3: value,
        });
        break;
        case 'question4':
          setFormData({
            ...formData,
            question4: value,
  
          });
          break;
          case 'question5':
            setFormData({
              ...formData,
              question5: value,
    
            });
            break;
      case 'cidacPrn':
        setFormData({
          ...formData,
          cidacPrn: value,
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
              cidacPrn: null,
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
              cidacPrn: null,
              organization: 'Other branch'
              // otherbranch: '',
            }));
            setErrors({
              ...errors,
              pnrNoError: false
            })
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

    if (name === 'name') {
      const isFullNameError = !validation.isValidFullName(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${name}Error`]: isFullNameError
      }));
    }
    if (name === 'email') {
      const isEmailError = !validation.isValidEmail(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${name}Error`]: isEmailError
      }));
    }

    // Validation for conatct
    if (name === 'contact') {
      const isContactError = !validation.isValidContact(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${name}Error`]: isContactError
      }));
    }
    // Validation for questions
    if (name === 'question1') {
      const isQuestionError1 = !validation.isValidQuestion(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        questionError: isQuestionError1
      }));
    }
    //  Validation for questions
    if (name === 'question2') {
      const isQuestionError2 = !validation.isValidQuestion(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        questionError2: isQuestionError2
      }));
    }
    if (name === 'question3') {
      const isQuestionError3 = !validation.isValidFeedbackAns(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        questionError3: isQuestionError3
      }));
    }
    if (name === 'question4') {
      const isQuestionError4 = !validation.isValidFeedbackAns(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        questionError4: isQuestionError4
      }));
    }
    if (name === 'question5') {
      const isQuestionError5 = !validation.isValidFeedbackAns(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        questionError5: isQuestionError5
      }));
    }
    if (name === 'cidacPrn') {
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



  };

  //---------------------------Function to handle form submission-------------------------------//
  const handleSubmit = (event) => {
    // Preventing default form submission behavior
    event.preventDefault();
    // Checking for validation errors before submission
    if (
      errors.nameError ||
      errors.emailError ||
      errors.contactError ||
      errors.questionError ||
      errors.questionError2 ||
      errors.answerError ||
      errors.otherBranchError ||
      errors.pnrNoError ||
      errors.questionError3 ||
      errors.questionError4 ||
      errors.questionError5
    ) {
      //--------------------Showing snackbar message for validation errors---------------------//
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
    if (branch == 'cdac' && (cidacPrn == '' || cidacPrn == null)) {

      setSnackbarOpen(true);
      setSeverity('error');
      setSnackbarMessage('Please enter PNR No.');
      return;
    }

    Post(urls.feedback, formData).then(response => {
      if (response?.status === 201 || response?.status === 200) {
        setSnackbarOpen(true);
        setSeverity('success');
        setSnackbarMessage('Thank you! Your feedback has been submitted.');
        dispatch(feedbackActions.postFeedback(response.data))
        setTimeout(() => {
          navigate('/')
        }, 2000);

      }
    }).catch((error) => {
      setSnackbarOpen(true);
      setSeverity('error');
      setSnackbarMessage(error?.message);
    })

    //------------------------------after submting clear the form----------------------------//
    setFormData({
      name: '',
      email: '',
      branch: '',
      contact: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      question5: '',
      cidacPrn: '',
      otherbranch: '',
      organization: '',
      datetime: new Date().toISOString().split('T')[0],
      branch_id: ''
    });



  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClick = () => {
    navigate('/'); // Navigate to the home page
  };

  //--------------------------------------destructure state--------------------------------//
  const { name, email, contact, question1, question2, question3, question4, question5, branch, otherbranch, cidacPrn, datetime } = formData;
  const isSubmitDisabled = !email || !contact || !question1 || !question2 || !question3 || !question4 || !question5 || errors.contactError || errors.emailError
    || errors.nameError || errors.otherBranchError || errors.pnrNoError || errors.questionError || errors.questionError2 || errors.questionError3 || errors.questionError4 || errors.questionError5
  // Rendering the form UI
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '120vh', fontSize: '45px' }}>
      <Grid item xs={12} sm={10} md={8} lg={6} >
        <Paper elevation={3} style={{ padding: 20, fontSize: '45px' }} >
          <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: isSmallScreen ? '20px' : '25px', color: 'primary.main' }} >Feedback Form</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={<span>Full name<span style={{ color: 'red' }}>*</span></span>}
                  name="name"
                  value={name}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 40 }}

                  error={errors.nameError}
                  helperText={errors.nameError && validation.errorText("Enter Valid Fullname")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={<span>Email<span style={{ color: 'red' }}>*</span></span>}
                  name="email"
                  value={email}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  variant="outlined"
                  inputProps={{ maxLength: 30 }}
                  size="small"

                  error={errors.emailError}
                  helperText={errors.emailError && validation.errorText("Enter Valid Email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={<span>Contact<span style={{ color: 'red' }}>*</span></span>}
                  name="contact"
                  value={contact}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 10 }}

                  sx={{ mb: 1 }}
                  error={errors.contactError}
                  helperText={errors.contactError && validation.errorText("Enter Valid Contact")}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography style={{ fontSize: "18px" }} textAlign='start' variant="subtitle1" gutterBottom>Select Organization<span style={{ color: 'red' }}>*</span></Typography>
                  <RadioGroup
                    row
                    aria-label="organization"
                    name="branch"
                    value={branch || " "}
                    onChange={(e) => handleChange(e)}
                  >
                    <FormControlLabel value="Branch" control={<Radio />} label="Hematite Branch" />
                    <FormControlLabel value="cdac" control={<Radio />} label="CDAC" />
                    <FormControlLabel value="otherbranch" control={<Radio />} label="Other Branch" />
                  </RadioGroup>

                  {formData.branch === 'Branch' && (allBranch && allBranch.length > 1 ? (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-autowidth-label">Select Branch </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth-label"
                        name='selectedBranch'
                        value={selectedBranch} // Use selectedBranch as the value
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        aria-label='Choose branch'
                        autoWidth
                        label='Select Branch'
                        size={isSmallScreen ? 'small' : 'medium'}
                        color='primary'
                      >
                        <MenuItem value='' aria-label='Choose branch'>Select Branch</MenuItem>
                        {allBranch && allBranch.map((val, index) => (
                          <MenuItem key={val.id} value={val.id}>{capitalizeFirstLetter(val.branchName)}</MenuItem>
                        ))}
                      </Select>

                    </FormControl>)
                    :   (
                      (() => {
                        // Directly set the value if only one branch exists
                        if (allBranch && allBranch.length === 1 && selectedBranch !== allBranch[0].id) {
                          handleChange({ target: { name: 'selectedBranch', value: allBranch[0].id } });
                        }
                        return null; // Do not render TextField
                      })()
                    ))}





                  {formData.branch === 'cdac' &&
                    <TextField
                      variant="outlined"
                      label="PRN No"
                      name="cidacPrn"
                      value={cidacPrn}
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 20 }}
                      fullWvariant="outlined"
                      size="small"
                      error={errors.pnrNoError}
                      helperText={(errors.pnrNoError && validation.errorText("Enter Valid PRN No"))}
                    />
                  }
                  {formData.branch === 'otherbranch' &&
                    <TextField
                      fullWidth
                      label="Other Branch"
                      name="otherbranch"
                      value={otherbranch}
                      onChange={(e) => handleChange(e)}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 30 }}
                      variant="outlined"
                      size="small"
                      error={errors.otherBranchError}
                      helperText={(errors.otherBranchError && validation.errorText("Enter Valid Other Branch"))}
                    />
                  }
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>How satisfied are you with our services?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField

                  fullWidth
                  label="Rate Us between 1 to 5"
                  name="question1"
                  value={question1}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 1 }}
                  required
                  error={errors.questionError}
                  helperText={errors.questionError && validation.errorText("Enter Valid Answer")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>How likely are you to recommend us to others?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label='Rate Us between 1 to 5'
                  name="question2"
                  value={question2}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  inputProps={{ maxLength: 1 }}
                  variant="outlined"
                  size="small"
                  required
                  error={errors.questionError2}
                  helperText={errors.questionError2 && validation.errorText("Enter Valid Answer")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom >What do you like most about our services?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label="Your answer"
                  name="question3"
                  value={question3}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  inputProps={{ maxLength: 500 }}
                  variant="outlined"
                  size="small"
                  required
                  multiline
                  rows={4}
                  error={errors.questionError3}
                  helperText={errors.questionError3 && validation.errorText("Enter Valid Answer,Max:500 characters")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>What areas do you think we can improve?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label="Your answer"
                  name="question4"
                  value={question4}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  required
                  multiline
                  rows={4}
                  error={errors.questionError4}
                  helperText={errors.questionError4 && validation.errorText("Enter Valid Answer,Max:500 characters")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>Any additional comments or suggestions?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label="Your answer"
                  name="question5"
                  value={question5}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  required
                  multiline
                  rows={4}
                  error={errors.questionError5}
                  helperText={errors.questionError5 && validation.errorText("Enter Valid Answer,Max:500 characters")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date and Time"
                  name="datetime"
                  value={datetime}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                  size="small"
                  disabled // Make the field disabled to prevent manual editing
                />
              </Grid>
            </Grid>
            <div style={{ display: 'flex', }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitDisabled}
                size='small'
              >
                Submit
              </Button>
              <Button
                onClick={handleClick}
                variant="contained"
                color="primary"
                size='small'
                sx={{ marginLeft: '12px' }}>
                Back
              </Button>

            </div>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity={severity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FeedbackForm;
