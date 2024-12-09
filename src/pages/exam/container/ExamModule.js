import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { TextField, Button, Card, CardContent } from '@mui/material';
import { Box, Grid, Typography, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions';
import DialogBox from '../../../component/common/DialogBox';
import { examActions } from '../examSliceReducer';
import { Post, Put, Delete, Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import * as validation from '../../../utils/constant';


function ExamModule() {
  const [exams, setExams] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState(null);
  const [isAddExam, setIsAddExam] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSnackbarSeverity] = useState('success');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState({
    id: null,
    examName: '',
    examTime: null,
    examStatus: false,
    totalQuestion: 0,
    showResult: false
  });
  const [errors, setErrors] = useState(
    {
      examNameError: false,
      examTimeError: false,
      totalQuestionError: false,

    }
  );
  const { allExam } = useSelector((store) => store.exam);
  const { SingleExam } = useSelector((store) => store.exam);
  const dispatch = useDispatch();
  const [showSubmitButton, setShowSubmitButton] = useState(true);


  //--------------------get exam-------------------------//
  useEffect(() => {
    Get(urls.exams).then(response => {
      console.log("exam data from mysql", response.data)
      const reversedexam = response.data.reverse(); // Reverse the array of users
      dispatch(examActions.GET_EXAM(reversedexam));
    })
      .catch(error => {
        setSnackbarOpen(true);
        setSnackbarMessage(`${error?.name}-${error?.message}`);
        setSnackbarSeverity('error')

      });
  }, [])

  useEffect(() => {
    setExams([...allExam])
  }, [allExam.length > 0, dispatch])

  useEffect(() => {
    setExams([...allExam])
  },);




  //-------------------------componentDidUpdate----------------------//

  useEffect(() => {
    if (SingleExam) {
      const { id = 0, examName = '', examTime = null, examStatus = false, showResult = false, totalQuestion = 0 } = SingleExam;
      setSelectedExam({
        id,
        examName,
        examStatus,
        examTime,
        totalQuestion,
        showResult,
      });
    }
  }, [SingleExam]);

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === 'examName') { // Corrected 'Password' to 'password'
      const isExamNameError = !validation.isValidExamName(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        examNameError: isExamNameError,

      }));
    }

    if (name === 'examTime') { // Corrected 'Password' to 'password'
      const isExamTimeError = !validation.isValidExamTime(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        examTimeError: isExamTimeError,

      }));
    }

    if (name === 'totalQuestion') { // Corrected 'Password' to 'password'
      const isTotalQuestionError = !validation.isValidQuestionCount(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalQuestionError: isTotalQuestionError,

      }));
    }
  }


  //-------- If the input type is radio, update the value based on the event---------- //
  const handleExamChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === 'radio' ? (value === 'true') : value;
  
    switch (name) {
      case 'examName':
        setSelectedExam(prevState => ({
          ...prevState,
          examName: newValue.toLowerCase()
        }));
        break;
  
      case 'examTime':
        setSelectedExam(prevState => ({
          ...prevState,
          examTime: newValue.toLowerCase()
        }));
        break;
  
      case 'totalQuestion':
        setSelectedExam(prevState => ({
          ...prevState,
          totalQuestion: newValue.toLowerCase()
        }));
        break;
  
      case 'examStatus':
        setSelectedExam(prevState => ({
          ...prevState,
          examStatus: newValue
        }));
        break;
  
      default:
        break;
    }
  };
  



  //------------------------function for handling the toggel change-----------------//

  // const toggelChange = (index, newExamStatus) => {
  //   const filteredExamIndex = page * rowsPerPage + index;
  //   const examToUpdate = filteredexam[filteredExamIndex];

  //   // Finding the index of the exam to update in the original list
  //   const originalIndex = exams.findIndex((exam) => exam.id === examToUpdate.id);
  //   console.log(originalIndex);
  //   if (originalIndex >= 0) {
  //     const updatedExam = {
  //       ...exams[originalIndex],
  //       examStatus: newExamStatus,
  //     };

  //     // Send the updated exam data to the backend API
  //     Put(`${urls.exams}${examToUpdate.id}/`, updatedExam)
  //       .then((response) => {
  //         // Dispatch the action to update the exam in the Redux store
  //         dispatch(examActions.UPDATE_EXAM(response.data));

  //         // Update the original list of exams with the new exam status
  //         const updatedExams = [...exams];
  //         updatedExams[originalIndex] = response.data;
  //         setExams(updatedExams);
  //       })
  //       .catch((error) => console.log("Exam error: ", error));
  //   }
  // };
  const toggelChange = (index, newExamStatus) => {
    const filteredExamIndex = page * rowsPerPage + index;
    const examToUpdate = filteredexam[filteredExamIndex];

    // Finding the index of the exam to update in the original list
    const originalIndex = exams.findIndex((exam) => exam.id === examToUpdate.id);
    console.log(originalIndex);
    if (originalIndex >= 0) {
      const updatedExam = {
        ...exams[originalIndex],
        examStatus: newExamStatus,
      };
      console.log(updatedExam);

      // Send the updated exam data to the backend API
      Put(`${urls.exams}${examToUpdate.id}/`, updatedExam)
        .then((response) => {
          if (response?.status === 200 || response?.status === 201) {
            // Dispatch the action to update the exam in the Redux store
            dispatch(examActions.UPDATE_EXAM(response.data));
            // Update the original list of exams with the new exam status
            const updatedExams = [...exams];
            updatedExams[originalIndex] = response.data;
            setExams(updatedExams);
          }
        })
        .catch((error) => {
          setSnackbarOpen(true);
          setSnackbarMessage(error?.message);
          setSnackbarSeverity('error')

        });
    }
  };
  const toggelResultChange = (index, newshowResult) => {
    const filteredExamIndex = page * rowsPerPage + index;
    const examToUpdate = filteredexam[filteredExamIndex];

    // Finding the index of the exam to update in the original list
    const originalIndex = exams.findIndex((exam) => exam.id === examToUpdate.id);
    console.log(originalIndex);
    if (originalIndex >= 0) {
      const updatedExam = {
        ...exams[originalIndex],
        showResult: newshowResult // Update showResult as well
      };
      console.log(updatedExam);

      // Send the updated exam data to the backend API
      Put(`${urls.exams}${examToUpdate.id}/`, updatedExam)
        .then((response) => {
          if (response?.status === 200 || response?.status === 201) {
            // Dispatch the action to update the exam in the Redux store
            dispatch(examActions.UPDATE_EXAM(response.data));

            // Update the original list of exams with the new exam status
            const updatedExams = [...exams];
            updatedExams[originalIndex] = response.data;
            setExams(updatedExams);
          }

        })
        .catch((error) => {
          setSnackbarOpen(true);
          setSnackbarMessage(error?.message)
          setSnackbarSeverity('error')
        });
    }
  };



  //-------------------------------delete operation--------------------------//
  // Function to open the delete popup model
  const openDeletePopup = (id) => {
    setIsDeletePopupOpen(true);
    setDeletingRecordId(id);
  };

  //----Function to close the delete popup model-----//
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeletingRecordId(null);
  };

  const deleteExam = (id) => {
    openDeletePopup(id);
  };

  const handleDeleteConfirmed = () => {
    Delete(`${urls.exams}${deletingRecordId}`)
      .then(response => {
        if (response?.status === 200 || response?.status === 201) {
          setSnackbarOpen(true);
          setSnackbarMessage('Exam Deleted!.');
          setSnackbarSeverity('success')
          dispatch(examActions.DELETE_EXAM(deletingRecordId))
        }
      })
      .catch(error => {
        setSnackbarOpen(true);
        setSnackbarMessage(error?.message);
        setSnackbarSeverity('error')
      });

    closeDeletePopup();

    // initExamRequest()
  };

  //--------------------- for add-update onchange method------------------------//
  const updateExam = (event) => {
    event.preventDefault();
    const { id = null, examName, examTime, examStatus, totalQuestion, showResult } = selectedExam;
    const updatedExam = {
      id,
      examName,
      examTime,
      examStatus,
      totalQuestion,
      showResult
    };
    const AddExam = {
      id,
      examName,
      examTime,
      examStatus: false,
      totalQuestion,
      showResult
    };

    const isUpdateDuplicate = exams.some(exam => exam.examName === examName && exam.id !== id);

    if (isAddExam) {
      if (isUpdateDuplicate) {
        setSnackbarOpen(true);
        setSnackbarMessage('An exam with the same name already exists.');
        setSnackbarSeverity('error')
        return;
      } 

      Post(urls.exams, AddExam)
        .then(response => {
          if (response?.status === 200 || response?.status === 201) {
            setSnackbarOpen(true);
            setSnackbarMessage('Exam Added!.');
            setSnackbarSeverity('success')
            dispatch(examActions.ADD_EXAM(response.data))
            const reverseExam = [response.data].reverse()
            const reversedExam = [...reverseExam, ...allExam]
            dispatch(examActions.GET_EXAM(reversedExam))
          }
        })
        .catch(error => {
          setSnackbarOpen(true);
          setSnackbarMessage(error?.message);
          setSnackbarSeverity('error')
        });



    } else {
      

        Put(`${urls.exams}${id}/`, updatedExam)
          .then(response => {
            if (response?.status === 200 || response?.status === 201) {
              setSnackbarOpen(true);
              setSnackbarMessage('Exam Updated!.');
              setSnackbarSeverity('success')
              dispatch(examActions.UPDATE_EXAM(response.data))
            }
          })
          .catch(error => {
            setSnackbarOpen(true);
            setSnackbarMessage(error?.message);
            setSnackbarSeverity('error')
          });


      
    }

    handleClose();
    // initExamRequest();
  };
  const resetError = () => {
    setErrors((prevState) => ({
      ...prevState, // Maintain the previous state
      examNameError: false,
      examTimeError: false,
      totalQuestionError: false,
    }));
  };

  //-------------------------validation for exam code--------------------------//
  const handleClose = () => {
    setOpen(false);
    resetError()
  };

  //---------------------------open popup to add exam popup------------------------//
  const handleOpen = (id = null) => {
    if (id !== null) {
      const data = exams.find(item => item.id === id);
      if (data) {
        setSelectedExam({ ...data });
        setOpen(true);
        setIsAddExam(false);
      }
    } else {
      setSelectedExam({
        id: null,
        examName: '',
        examStatus: false,
        totalQuestion: 0,
        showResult: false
      });
      setOpen(true);
      setIsAddExam(true);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };
  //--------------------------to handle the pagination------------------------------------//
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //----------------------function for handle the search operation-----------------------//
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredexam = exams.filter((val) => {
    const query = searchQuery.toLowerCase();
    const nameInludes = val?.examName && val?.examName?.toLowerCase().includes(query);
    const examIdIncludes = val?.id && val?.id?.toString().includes(query);
    return nameInludes || examIdIncludes;
  });

  const isSubmitDisabled = !selectedExam.examName || errors.examNameError || errors.examTimeError || errors.totalQuestionError
    || !selectedExam.examTime || !selectedExam.totalQuestion;


  return (
    <>
      <Card sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20, borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar component='nav' position="static" sx={{ boxShadow: 'none', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
              >
                Manage Exam
              </Typography>
              <TextField
                className='searchinput'
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Exam"
                variant="outlined"
                size='small'
                sx={{
                  backgroundColor: 'white',
                  borderRadius: "4px",
                  width: "auto",
                  border: 'none'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Toolbar>
          </AppBar>
        </Box>
        <CardContent sx={{ borderRadius: 'none' }}  >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button variant="contained" color="primary" sx={{ marginBottom: 2 }} size="small" type="button" startIcon={<AddIcon />} onClick={() => (handleOpen())}>Exam</Button>
          </div>
          <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
            <Table aria-label="simple table" sx={{}} >
              <TableHead >
                <TableRow>
                  <TableCell ><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Sr No</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Exam Id</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Exam Name</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Exam Status</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Exam Time(min)</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Total Questions</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Show Answer</Typography></TableCell>
                  <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Action</Typography></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {filteredexam.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="left">
                      <strong style={{ fontSize: "28px" }}>No data found</strong>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredexam && filteredexam.length > 0 && filteredexam.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, index) => {
                    const currentIndex = page * rowsPerPage + index;
                    return (
                      <TableRow key={index}>
                        <TableCell align='left'>{currentIndex + 1}</TableCell>
                        <TableCell align='left'>{val.id}</TableCell>
                        <TableCell align='left'>{capitalizeFirstLetter(val.examName)}</TableCell>
                        <TableCell align='left'>
                          <Switch
                            checked={val.examStatus}
                            onChange={() => toggelChange(index, !val.examStatus)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </TableCell>
                        <TableCell align='left'>{val.examTime}</TableCell>
                        <TableCell align='left'>{val.totalQuestion}</TableCell>
                        <TableCell align="left">
                          <Switch
                            checked={val.showResult} // Bind showResult state to the switch
                            onChange={() => toggelResultChange(index, !val.showResult)} // Handle toggle for showResult
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton aria-label="edit"  >
                            <EditIcon onClick={() => handleOpen(val.id)} style={{ color: '#2c387e', fontSize: '25px' }} />
                          </IconButton>
                          <IconButton aria-label="delete"  >
                            <DeleteIcon onClick={() => deleteExam(val.id)} style={{ color: '#2c387e', fontSize: '25px' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={8}
              count={filteredexam.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions.default}
            />
          </TableContainer>
        </CardContent>
        <DialogBox
          open={open}
          onClose={handleClose}
          onConfirm={updateExam}
          show={showSubmitButton}
          title={isAddExam ? 'Add Exam' : 'Update Exam'}
          content={
            <form onSubmit={updateExam}>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="Exam Name"
                    variant="outlined"
                    fullWidth
                    name="examName"
                    value={selectedExam.examName}
                    onChange={handleExamChange}
                    size='small'
                    inputProps={{ maxLength: 30 }}
                    onBlur={handleBlur}
                    error={errors.examNameError}
                    helperText={(errors.examNameError && validation.errorText("Enter Valid Exam Name"))}
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="Exam Time"
                    variant="outlined"
                    fullWidth
                    name="examTime"
                    value={selectedExam.examTime}
                    onChange={handleExamChange}
                    size='small'
                    placeholder='enter a time (1min)'
                    onBlur={handleBlur}
                    inputProps={{ maxLength: 6 }}
                    error={errors.examTimeError}
                    helperText={(errors.examTimeError && validation.errorText("Enter Valid Exam Time.E.g-1min"))}
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="Total Questions"
                    variant="outlined"
                    fullWidth
                    name="totalQuestion"
                    value={selectedExam.totalQuestion}
                    onChange={handleExamChange}
                    inputProps={{ maxLength: 3 }}
                    size='small'
                    placeholder='enter a count of questions'
                    onBlur={handleBlur}
                    error={errors.totalQuestionError}
                    helperText={(errors.totalQuestionError && validation.errorText("Enter Valid Questions Count"))}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Exam Status</FormLabel>
                    <RadioGroup aria-label="examstatus" name="examStatus">
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="Disabled"
                        checked={!selectedExam.examStatus}
                        onChange={handleExamChange}
                      />
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Enabled"
                        checked={selectedExam.examStatus}
                        onChange={handleExamChange}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid> */}
              </Grid>
            </form>
          }
          disable={isSubmitDisabled}
          submitLabel={isAddExam ? 'Add Exam' : 'Update Exam'}
        />
        <DialogBox
          open={isDeletePopupOpen}
          onClose={closeDeletePopup}
          onConfirm={() => {
            closeDeletePopup();
            handleDeleteConfirmed();
          }}
          show={true}
          message={`Are you sure you want to delete this record?`}
          title={`Delete Record`}
          submitLabel={`Delete`}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert onClose={closeSnackbar} severity={severity} variant="filled" sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Card>

    </>
  );
}



export default ExamModule