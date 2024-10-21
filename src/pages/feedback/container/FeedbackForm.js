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
    questionError3:false,
    questionError4:false,
    questionError5:false,
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

  //----------------------------Function to handle changes in form fields----------------------//
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'selectedBranch') {
      setSelectedBranch(value); // Update selectedBranch with the new value
      console.log(selectedBranch);
      const selectedBranchObject = allBranch.find(branch => branch.id === value);
      const branchId = selectedBranchObject ? selectedBranchObject.id : ''; // Get the branch id from the selected branch object
      setFormData({
        ...formData,
        branch_id: branchId, // Update branch_id in formData
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (name === 'branch' && value === 'Branch') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        cidacPrn: null,
        otherbranch: '',
        organization: 'Hematite branch'
      }));
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
      errors.questionError2||
      errors.answerError||
      errors.otherBranchError||
      errors.pnrNoError
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
      dispatch(feedbackActions.postFeedback(response.data))

    }).catch((error) => {
      console.log(error)
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

    setSnackbarOpen(true);
    setSeverity('success');
    setSnackbarMessage('Thank you! Your feedback has been submitted.');
    setTimeout(() => {
      navigate('/')
    }, 2000);

  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClick = () => {
    navigate('/'); // Navigate to the home page
  };

  //--------------------------------------destructure state--------------------------------//
  const { name, email, contact, question1, question2, question3, question4, question5, branch, otherbranch, cidacPrn, datetime } = formData;
  const isSubmitDisabled = !email || !contact || !question1 || !question2 || !question3 || !question4 || !question5 ||errors.contactError||errors.emailError
  || errors.nameError || errors.otherBranchError || errors.pnrNoError|| errors.questionError|| errors.questionError2
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 40 }}
             
                  error={errors.nameError}
                  helperText={errors.nameError && validation.errorText("Invalid fullname")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={<span>Email<span style={{ color: 'red' }}>*</span></span>}
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  inputProps={{ maxLength: 30 }}
                  size="small"

                  error={errors.emailError}
                  helperText={errors.emailError && validation.errorText("Invalid email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={<span>Contact<span style={{ color: 'red' }}>*</span></span>}
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 10 }}
                  
                  sx={{ mb: 1 }}
                  error={errors.contactError}
                  helperText={errors.contactError && validation.errorText("Invalid contact")}
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
                    onChange={handleChange}
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
                        onChange={handleChange}
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
                    : (
                      <TextField
                        fullWidth
                        size='small'
                        value={allBranch && allBranch[0] ? allBranch[0].branchName : ''}
                        name='selectedBranch'
                        label="Branch"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    ))}




                  {formData.branch === 'cdac' &&
                    <TextField
                      variant="outlined"
                      label="PRN No"
                      name="cidacPrn"
                      value={cidacPrn}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 20 }}
                      fullWvariant="outlined"
                      size="small"
                      error={errors.pnrNoError}
                      helperText={(errors.pnrNoError && validation.errorText("Invalid PRN No"))}
                    />
                  }
                  {formData.branch === 'otherbranch' &&
                    <TextField
                      fullWidth
                      label="Other Branch"
                      name="otherbranch"
                      value={otherbranch}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 30 }}
                      variant="outlined"
                      size="small"
                      error={errors.otherBranchError}
                      helperText={(errors.otherBranchError && validation.errorText("Invalid other branch"))}
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 1 }}
                  required
                  error={errors.questionError}
                  helperText={errors.questionError && validation.errorText("Invalid answer")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>How likely are you to recommend us to others?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label='Rate Us between 1 to 5'
                  name="question2"
                  value={question2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{ maxLength: 1 }}
                  variant="outlined"
                  size="small"
                  required
                  error={errors.questionError2}
                  helperText={errors.questionError2 && validation.errorText("Invalid answer")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom >What do you like most about our services?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label="Your answer"
                  name="question3"
                  value={question3}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{maxLength:500}}
                  variant="outlined"
                  size="small"
                  required
                  multiline        
                  rows={4} 
                  error={errors.questionError3}
                  helperText={errors.questionError3 && validation.errorText("Invalid answer,Max:500 characters")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>What areas do you think we can improve?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label="Your answer"
                  name="question4"
                  value={question4}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  required
                  multiline        
                  rows={4}
                  error={errors.questionError4}
                  helperText={errors.questionError4 && validation.errorText("Invalid answer,Max:500 characters")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="start" variant="subtitle1" gutterBottom>Any additional comments or suggestions?<span style={{ color: 'red' }}>*</span></Typography>
                <TextField
                  fullWidth
                  label="Your answer"
                  name="question5"
                  value={question5}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  size="small"
                  required
                  multiline        
                  rows={4}
                  error={errors.questionError5}
                  helperText={errors.questionError5 && validation.errorText("Invalid answer,Max:500 characters")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date and Time"
                  name="datetime"
                  value={datetime}
                  onChange={handleChange}
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
