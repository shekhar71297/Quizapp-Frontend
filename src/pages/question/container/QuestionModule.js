import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Papa from 'papaparse';
import * as XLSX from 'xlsx'; // Import XLSX

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  TableContainer,
  Paper,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { PhotoCamera as ImageIcon } from '@mui/icons-material';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { BiSolidFileExport } from "react-icons/bi";
import { BiExport } from "react-icons/bi";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TablePagination from '@mui/material/TablePagination';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { BiImport } from "react-icons/bi";
import Grid from '@mui/material/Grid';
import { examActions } from '../../exam/examSliceReducer';
import { Get, Post, Put, Delete } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { questionActions } from '../questionSliceReducer';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import CancelIcon from '@mui/icons-material/Cancel';
import './question.css'
import * as validation from '../../../utils/constant';
const QuestionModule = () => {
  const [formValues, setFormValues] = useState({
    open: false,
    selectedExam: null,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    questionImage: null,
    marks: null,
    editingQuestion: null,
    level: '',
  });

  const { open, selectedExam, question, option1, option2, option3, option4, answer, marks, questionImage, editingQuestion, level } = formValues;
  const [page, setPage] = useState(0);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  const [isValidMark, setIsValidMark] = useState(true);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { allquestions } = useSelector((store) => store.question);
  const { allExam } = useSelector((store) => store.exam);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [csvData, setCsvData] = useState([]);
  const [examName, setExamName] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [errors, setErrors] = useState(
    {
      marksError: false,

    }
  );

  useEffect(() => {
    Get(urls.exams)
      .then((response) => {
        const reversedData = response.data.reverse(); // Reverse the array of users
        dispatch(examActions.GET_EXAM(reversedData));
      })
      .catch((error) => console.log("Exam error: ", error));
  }, []);

  useEffect(() => {
    Get(urls.question)
      .then((response) => {
        dispatch(questionActions.getQuestion(response.data));
      })
      .catch((error) => console.log("Exam error: ", error));
  }, [selectedExam, formValues, successSnackbarOpen]);

  useEffect(() => {
    // Convert data to CSV format when allquestions or selectedExam changes
    if (allquestions && allquestions.length >= 0 && selectedExam !== null) {
      const filteredData = allquestions.filter(question => question?.exam?.id === selectedExam);
      const data = filteredData.map((question) => ({
        question: question.question,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        answer: question.answer,
        marks: question.marks,
        level: question.level,
        exam_id: selectedExam
      }));
     

      // Set the exam name for generating file name
      const selectedExamObject = allExam.find(exam => exam.id === selectedExam);
      // Check if selectedExamObject is not null before accessing its properties
      if (selectedExamObject !== null) {
        setExamName(selectedExamObject?.examName);
      } else {
        // Clear the exam name if selectedExamObject is null
        setExamName('');
      }

      const headings = ['question', 'option1', 'option2', 'option3', 'option4', 'answer', 'marks', 'level', 'exam_id'];
      const csvContent = [headings, ...data];
      setCsvData(csvContent);
    }
  }, [allquestions, selectedExam, allExam]);

  const handleOptionChange = (optionName, value) => {
    if (optionName === 'questionImage' && value instanceof File) {
      // Check if the file size is more than 5MB (in bytes)
      if (value.size > 5 * 1024 * 1024) {
        // Set error message and flag to indicate invalid file size
        setErrorMessage('File size should be less than 5MB.');
        setErrorSnackbarOpen(true);
        setIsValidFileSize(false);
        return;
      } else {
        // Set flag to indicate valid file size if the file size is within the limit
        setIsValidFileSize(true);
      }
    }
    if (optionName === 'marks') {
      if (!Number.isInteger(Number(value))) {
        setErrorMessage('Only numeric value accepted .');
        setErrorSnackbarOpen(true);
        setIsValidMark(false)
      }
    }
    setFormValues(prevState => ({
      ...prevState,
      [optionName]: value,
    }));

  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === 'marks') { // Corrected 'Password' to 'password'
      const isMarksError = !validation.isValidMark(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        marksError: isMarksError,

      }));
    }
  }
  const handleSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  //--------------------------to handle the pagination------------------------------------//
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidFileSize) {
      return; // Prevent submission if file size is invalid
    }
    if (!isValidMark) {
      return; // Prevent submission if file size is invalid
    }


    if (question == '' || option1 == '' || option2 == '') {
      setErrorMessage('Please provide a question, answer, and at least two options.');
      setErrorSnackbarOpen(true);
      setIsValidFileSize(false);
      return;
    }


    const formData = new FormData();
    formData.append('question', question);
    formData.append('option1', option1);
    formData.append('option2', option2);
    formData.append('option3', option3);
    formData.append('option4', option4);
    formData.append('answer', answer);
    formData.append('marks', marks);
    formData.append('level', level);
    formData.append('exam_id', selectedExam);

    // Append image if available
    if (questionImage) {
      formData.append('questionImage', questionImage);
    }
  

    Post(urls.question, formData)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          setSuccessSnackbarOpen(true)
          setSnackbarMessage('Question added !')
          dispatch(questionActions.addQuestion(response.data));
        }

        // Reset form field values
        setFormValues({
          ...formValues,
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          answer: '',
          marks: null,
          level: '',
          questionImage: null,
        });
        handleClose();
      })
      .catch((error) => {
        setErrorSnackbarOpen(true)
        setErrorMessage(error?.message)
      });


  };

  const handleClickOpen = () => {
    setFormValues({
      ...formValues,
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
      marks: null,
      level: '',
      questionImage: null,
      open: true,
      editingQuestion: null, // Reset editing question when opening dialog for adding
    });
  };

  const handleClose = () => {
    setFormValues(prevState => ({
      ...prevState,
      open: false,
    }));
  };

  const handleExamChange = (event) => {
    const selectedExamId = Number(event.target.value);
    setFormValues(prevState => ({
      ...prevState,
      selectedExam: selectedExamId,
    }));
  };

  const handleDelete = (questionId) => {
    Delete(`${urls.question}${questionId}`)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          setSuccessSnackbarOpen(true)
          setSnackbarMessage('Question Deleted !')
          dispatch(questionActions.deleteQuestion(questionId))
        }
      }

      )

      .catch((error) => {
        setErrorSnackbarOpen(true)
        setErrorMessage(error?.message)
      });
  };

  const handleEdit = (question) => {
    setFormValues({
      open: true,
      selectedExam: question?.exam?.id,
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      answer: question.answer,
      marks: question.marks,
      level: question.level,
      questionImage: question.questionImage, // Set the question image for editing
      editingQuestion: question,
    });
  };

  const handleEditSubmit = () => {
    const formData = new FormData();
    formData.append('question', question);
    formData.append('option1', option1);
    formData.append('option2', option2);
    formData.append('option3', option3);
    formData.append('option4', option4);
    formData.append('answer', answer);
    formData.append('marks', marks);
    formData.append('level', level);
    formData.append('exam_id', selectedExam);

    if (questionImage instanceof File) {
      const fileName = questionImage.name;
      formData.append('questionImage', questionImage, fileName);
    }

    // Make the API call to update the question
    Put(`${urls.question}${editingQuestion.id}/`, formData)
      .then((response) => {
        if (response?.status === 200 || response.status === 201) {
          setSuccessSnackbarOpen(true)
          setSnackbarMessage('Question Updated !')
          // Dispatch action to update the question in the Redux store
          dispatch(questionActions.updateQuestion(response.data));  
        }

        // Reset form field values
        setFormValues({
          ...formValues,
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          answer: '',
          marks: null,
          level: '',
          questionImage: null,
        });
        handleClose();
      })
      .catch((error) => {
        setErrorSnackbarOpen(true)
        setErrorMessage(error?.response?.data?.message)
      });

  };
  // -------------------------------File upload------------------------------//
 const handleFileSubmit = () => {
  if (!selectedFile) {
    setErrorSnackbarOpen(true); // Open the error snackbar if no file is selected
    setErrorMessage('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);

  // Use PapaParse to parse the CSV file
  Papa.parse(selectedFile, {
    complete: (result) => {
  

      // If the result has errors, prevent API call and show error
      if (result.errors && result.errors.length > 0) {
        setErrorSnackbarOpen(true);
        setErrorMessage('There was an error with the file format.');
        return; // Early return to prevent the API call
      }

      // Proceed only if there are no parsing errors
      if (result.data && result.data.length > 0) {
        // File is successfully parsed, call the Post API to upload the file
        Post(urls.upload_csv, formData)
          .then((response) => {
            if (response?.status === 200 || response?.status === 201) {
              setSuccessSnackbarOpen(true);
              setSnackbarMessage('File uploaded successfully!');
              dispatch(questionActions.addCsvFile(response.data));
            }
          })
          .catch((error) => {
            console.error(error);
            setErrorSnackbarOpen(true);
            setErrorMessage(error?.response?.data?.message || 'An error occurred during file upload.');
          });
      } else {
        setErrorSnackbarOpen(true);
        setErrorMessage('No valid data found in the file.');
      }
    },
    error: (error) => {
      console.error(error);
      setErrorSnackbarOpen(true);
      setErrorMessage('Error parsing the CSV file.');
    },
  });
};


//   if (!selectedFile) {
//     setErrorSnackbarOpen(true); // Open the error snackbar if no file is selected
//     setErrorMessage('Please select a file to upload.');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('file', selectedFile);

//   // Use PapaParse to parse the CSV file
//   Papa.parse(selectedFile, {
//     complete: (result) => {
//       console.log('Parsed result:', result); // Check the parsed content
      
//       // Validate the parsed data, you can customize this based on your use case
//       if (result.errors.length) {
//         setErrorSnackbarOpen(true);
//         setErrorMessage('There was an error with the file format.');
//         return;
//       }

//       // Process valid CSV data here
//       Post(urls.upload_csv, formData)
//         .then((response) => {
//           if (response?.status === 200 || response?.status === 201) {
//             setSuccessSnackbarOpen(true);
//             setSnackbarMessage('File uploaded!');
//             dispatch(questionActions.addCsvFile(response.data));
//           }
//         })
//         .catch((error) => {
//           console.error(error);
//           setErrorSnackbarOpen(true);
//           setErrorMessage(error?.response?.data?.message);
//         });
//     },
//     error: (error) => {
//       console.error(error);
//       setErrorSnackbarOpen(true);
//       setErrorMessage('Error parsing CSV file.');
//     },
//   });
// };




  // const handleFileSubmit = () => {
  //   if (!selectedFile) {
  //     setErrorSnackbarOpen(true); // Open the error snackbar if no file is selected
  //     setErrorMessage('Please select a file to upload.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', selectedFile); // Use 'file' as the field name
  //   formData.append('Content-Type', 'multipart/form-data'); // Set content type for file upload

  //   Post(urls.upload_csv, formData)
  //     .then((response) => {
  //       if(response?.status === 200 || response?.status===201){
  //         setSuccessSnackbarOpen(true);
  //         setSnackbarMessage('File uploaded !')
  //         dispatch(questionActions.addCsvFile(response.data));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error); // Log error for debugging or display an error message to the user
  //       setErrorSnackbarOpen(true); // Open the error snackbar
  //       setErrorMessage(error?.message);
  //     });
  // };

  //-------------------------------------Export csv----------------------------//
  const handleExportCSV = () => {
    // Trigger download when export button is clicked
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
      csvData.map(row => Object.values(row).join(',')).join('\n')
    );
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${examName}_Questions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };


  //-------------------------------------Export csv format----------------------------//
  const handleExportCSVFormat = () => {
    const headers = ['question', 'option1', 'option2', 'option3', 'option4', 'answer', 'marks', 'level', 'exam_id'];
    const demoData = ["HTML stands for?", "HyperText Machine Language", "HyperText Markup Language", "HyperText Marking Language", "HighText Marking Language", "option2", "1", "simple/intermediate/complex", "1"];
    // Create CSV content with headers and one row of demo data
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${demoData.join(',')}\n`;
    // Create a download link for the CSV file with headers and demo data
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `QuestionsCsvFormat.csv`); // The file name is based on examName
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const isSubmitDisabled = !question || !option1 || !option2 || !answer || !marks || !isValidFileSize || !level;

  const filteredQuestions = allquestions && allquestions.length > 0 && allquestions.filter((question) => question?.exam?.id === selectedExam);
  
  const questionLevels = ['simple', 'intermediate', 'complex'];
  return (
    <>
      <Snackbar open={errorSnackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={successSnackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={handleSuccessSnackbarClose}>
        <Alert onClose={handleSuccessSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Card sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20, borderRadius: '0px' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar component='nav' position="static" sx={{ boxShadow: 'none' }} >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
              >
                Manage Question
              </Typography>


              {selectedExam && (
                <>
                  <label htmlFor="file-upload" className="custom-file-upload" style={{ fontSize: isSmallScreen ? '13px' : '15px' }} >
                    <input
                      id="file-upload"
                      size={isSmallScreen ? "small" : 'medium'}
                      type="file"
                      accept=".csv"
                      onChange={(event) => setSelectedFile(event.target.files[0])}
                    />
                    {selectedFile ? selectedFile.name : isSmallScreen ? 'Select file' : 'Click here to select a file'}
                  </label>
                  <Button sx={{ fontSize: isSmallScreen ? '10px' : '14px', color: 'black', marginLeft: '8px' }} variant="contained" color='inherit' component="label" startIcon={<BiImport />} onClick={handleFileSubmit} >
                    Import Csv
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
        <CardContent sx={{ borderRadius: 'none' }}  >
          <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
            <Table aria-label="simple table">
              <TableRow>
                <TableCell colSpan={9} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                  {selectedExam && (
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                      <Button
                        variant="contained"
                        color="primary"
                        component={'button'}
                        size='small'
                        // sx={{ position: "relative",  fontSize: "12px", fontWeight: "bolder" }}
                        startIcon={<AddIcon />}
                        onClick={handleClickOpen}>
                        Add
                      </Button>
                      {filteredQuestions.length > 0 ? (<Button
                        variant="contained"
                        color="primary"
                        component={'button'}
                        size='small'
                        sx={{ left: '7%' }}
                        startIcon={<BiExport />}
                        onClick={handleExportCSV} // Attach the event handler to the button
                      >
                        Export CSV
                      </Button>) : null}

                    </div>
                  )}
                  {!selectedExam && (
                    <Button
                      variant="contained"
                      color="primary"
                      component={'button'}
                      size='small'
                      // sx={{ left: '7%' }}
                      startIcon={<BiSolidFileExport />}
                      onClick={handleExportCSVFormat} // Attach the event handler to the button
                    >
                      Export CSV Format
                    </Button>

                  )}
                  <FormControl size='small' >
                    <InputLabel id="demo-simple-select-autowidth-label" style={{ fontSize: isSmallScreen ? '12px' : '16px' }}>Select Exam</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth-label"

                      value={selectedExam}
                      onChange={handleExamChange}
                      autoWidth
                      style={{ backgroundColor: 'white', width: isSmallScreen ? '130px' : '200px', height: isSmallScreen ? '30px' : "40px" }}
                      label="Select Exam"
                    >
                      <MenuItem aria-readonly sx={{ width: isSmallScreen ? '130px' : '200px', height: isSmallScreen ? '30px' : "40px", justifyContent: 'center' }} >None</MenuItem>
                      {allExam.map((exam) => (
                        <MenuItem key={exam.id} value={exam.id} sx={{ width: isSmallScreen ? '130px' : '200px', height: isSmallScreen ? '30px' : "40px", justifyContent: 'center' }}  >
                          {capitalizeFirstLetter(exam.examName)}
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontSize: '18px', display: "flex", justifyContent: "space-between" }}>{editingQuestion ? 'Edit Question' : 'Add Question'}
                  <CancelIcon onClick={handleClose} style={{ fontSize: '25px' }} />
                </DialogTitle>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Question"
                      variant="outlined"
                      margin="normal"
                      value={question}
                      onChange={(e) => handleOptionChange('question', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Option 1"
                      variant="outlined"
                      margin="normal"
                      value={option1}
                      onChange={(e) => handleOptionChange('option1', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Option 2"
                      variant="outlined"
                      margin="normal"
                      value={option2}
                      onChange={(e) => handleOptionChange('option2', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Option 3"
                      variant="outlined"
                      margin="normal"
                      value={option3}
                      onChange={(e) => handleOptionChange('option3', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Option 4"
                      variant="outlined"
                      margin="normal"
                      value={option4}
                      onChange={(e) => handleOptionChange('option4', e.target.value)}
                    />
                    <FormControl fullWidth sx={{ marginTop: '18px' }} >
                      <InputLabel id="answer-label">Answer</InputLabel>
                      <Select
                        labelId="answer-label"
                        id="answer"
                        value={answer}
                        onChange={(e) => handleOptionChange('answer', e.target.value)}
                        label="Answer"
                      >
                        <MenuItem value='option1'>Option1</MenuItem>
                        <MenuItem value='option2'>Option2</MenuItem>
                        <MenuItem value='option3'>Option3</MenuItem>
                        <MenuItem value='option4'>Option4</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ marginTop: '24px' }} >
                      <InputLabel id="question-level-label">Question Level</InputLabel>
                      <Select
                        labelId="question-level-label"
                        id="question-level"
                        label='Question level'
                        value={level}
                        name='level'
                        onChange={(e) => handleOptionChange('level', e.target.value)}
                      >
                        {questionLevels.map((level, index) => (
                          <MenuItem key={index} value={level}>{capitalizeFirstLetter(level)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      sx={{ marginTop: '24px' }}
                      fullWidth
                      label="Marks"
                      variant="outlined"
                      margin="normal"
                      value={marks}
                      name='marks'
                      onChange={(e) => handleOptionChange('marks', e.target.value)}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 2 }}
                      error={errors.marksError}
                      helperText={(errors.marksError && validation.errorText("Invalid marks.E.g-1,10"))}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label='Select Image'
                      margin="normal"
                      type="file"
                      onChange={(e) => handleOptionChange('questionImage', e.target.files[0])}
                      accept="image/*"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ImageIcon />
                          </InputAdornment>
                        ),
                      }}

                    />

                  </form>
                </DialogContent>
                <DialogActions>
                  <Button variant='outlined' size='small' onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button size='small' onClick={editingQuestion ? handleEditSubmit : handleSubmit} disabled={isSubmitDisabled} color="primary" variant="contained">
                    {editingQuestion ? 'Save' : 'Submit'}
                  </Button>
                </DialogActions>
              </Dialog>

              <TableRow>
                <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>{filteredQuestions.length > 0 ? 'Questions' : 'Questions not found'}</Typography>
                </TableCell>
              </TableRow>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <strong style={{ fontSize: "28px" }}>No data found</strong>
                    </TableCell>
                  </TableRow>
                ) : (

                  filteredQuestions && filteredQuestions.length > 0 && filteredQuestions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((submittedQuestion, index) => {
                    const currentIndex = page * rowsPerPage + index;
                    return (
                      <Accordion key={index} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Grid container sx={{ textAlign: 'left' }} spacing={2}>
                            <Grid item xs={8}>
                              <Typography sx={{ fontSize: '18px' }}>Que {currentIndex + 1}: {submittedQuestion.question}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <div style={{ position: 'relative', left: "30%", color: '#2c387e' }}>{submittedQuestion.marks} Marks</div>
                            </Grid>
                            <Grid item xs={2}>
                              <div style={{ position: 'relative', left: "0%", color: '#2c387e' }}>Level:{submittedQuestion.level} </div>
                            </Grid>
                          </Grid>
                        </AccordionSummary>

                        <AccordionDetails >
                          <ul style={{ listStyleType: 'none' }}>
                            {submittedQuestion.questionImage && (
                              <li style={{ maxWidth: '400px', objectFit: 'cover' }} >
                                <img src={submittedQuestion.questionImage} alt="Question Image" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                              </li>
                            )}
                            <li style={{ boxShadow: 'inset 0px 0px 3px 0px black', height: '40px', paddingTop: '10px', marginTop: '7px' }}  >Option 1 : {submittedQuestion.option1}</li>
                            <li style={{ boxShadow: 'inset 0px 0px 3px 0px black', height: '40px', paddingTop: '10px', marginTop: '7px' }}  >Option 2 : {submittedQuestion.option2}</li>
                            <li style={{ boxShadow: 'inset 0px 0px 3px 0px black', height: '40px', paddingTop: '10px', marginTop: '7px' }}  >Option 3 : {submittedQuestion.option3}</li>
                            <li style={{ boxShadow: 'inset 0px 0px 3px 0px black', height: '40px', paddingTop: '10px', marginTop: '7px' }}  >Option 4 : {submittedQuestion.option4}</li>
                            <li style={{ backgroundColor: '#2c387eb8', color: 'white', boxShadow: 'inset 0px 0px 3px 0px black', height: '40px', paddingTop: '10px', marginTop: '7px' }}>Answer: {submittedQuestion.answer}</li>
                          </ul>
                          <IconButton color='primary' onClick={() => handleEdit(submittedQuestion)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color='primary' onClick={() => handleDelete(submittedQuestion.id)}>
                            <DeleteIcon />
                          </IconButton>

                        </AccordionDetails>
                      </Accordion>

                    )
                  }))}

              </TableBody>
              {filteredQuestions?.length > 0 ? (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={7}
                  count={filteredQuestions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

              ) : null}

            </Table>
          </TableContainer>
        </CardContent>
      </Card>

    </>
  );
};

export default QuestionModule;