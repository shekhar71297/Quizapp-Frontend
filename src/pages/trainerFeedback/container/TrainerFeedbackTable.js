import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Grid, Typography } from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DialogBox from '../../../component/common/DialogBox';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions';
import { formatDate } from '../../../component/common/DateFormat';
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { feedbackAnsActions } from '../trainerSliceReducer';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { ResponsiveContainer } from 'recharts';

const TrainerFeedbackTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { allFeedbackAns } = useSelector((store) => store.feedbackAns);
  const { allBatch } = useSelector((store) => store.feedbackAns);
  const { allBatchWiseStudent,allEmployee,allCourses } = useSelector((store) => store.feedbackAns);
  const [parsedQA, setParsedQA] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    Get(urls.feedbackAns).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getFeedbackAns(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);

  useEffect(() => {
    Get(urls.batch).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getBatch(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);

  useEffect(() => {
    Get(urls.course).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getCourses(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);

  useEffect(() => {
    Get(urls.employee).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getEmployee(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);

  useEffect(() => {
    Get(urls.batchWiseStudent).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getBatchWiseStudent(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);

  const searchFeedback = allFeedbackAns?.filter(val => {
    const matchesSearchQuery = () => {
      const fname = val?.batchwise?.student?.fname?.toLowerCase().includes(searchQuery.toLowerCase());
      const email = val?.batchwise?.student?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const course = val?.batchwise?.batch?.course?.CourseName?.toLowerCase().includes(searchQuery.toLowerCase());
      const faculty = val?.batchwise?.batch?.trainer?.fname?.toLowerCase().includes(searchQuery.toLowerCase());
      const date = val?.datetime?.includes(searchQuery);
      return fname || email || date || course || faculty;
    };

    const matchesTrainer = selectedTrainer ? val?.batchwise?.batch?.trainer?.id === selectedTrainer : true;
    const matchesCourse = selectedCourse ? val?.batchwise?.batch?.course?.id === selectedCourse : true;
    const matchesBatch = selectedBatch ? val?.batchwise?.batch?.batchname === selectedBatch : true;

    return matchesSearchQuery() && matchesTrainer && matchesCourse && matchesBatch;
  }) || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleEyeIconClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowSubmitButton(false);

    const qaPairs = feedback.answer
      .split(',')
      .map(pair => {
        const [question, answer] = pair.split(':').map(part => part.trim());
        return { question, answer };
      });

    setParsedQA(qaPairs);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTrainerChange = (event) => {
    setSelectedTrainer(event.target.value);
    setPage(0);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setPage(0);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setPage(0);
  };

  const calculatePercentage = (feedback) => {
    const ratings = feedback.answer.split(',').map(pair => {
      const [, answer] = pair.split(':').map(part => part.trim());
      return parseInt(answer, 10);
    });

    const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
    const totalQuestions = ratings.length;
    const percentage = (totalRatings / (totalQuestions * 5)) * 100;

    return percentage;
  };

  const categorizeFeedback = (percentage) => {
    if (percentage >= 80) {
      return 'Excellent';
    } else if (percentage >= 60) {
      return 'Good';
    } else if (percentage >= 40) {
      return 'Average';
    } else {
      return 'Poor';
    }
  };

  const feedbackCategoryCounts = () => {
    const counts = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0
    };

    searchFeedback.forEach((feedback) => {
      const percentage = calculatePercentage(feedback);
      const category = categorizeFeedback(percentage);
      counts[category]++;
    });

    return counts;
  };

  const pieData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Feedback Category Distribution',
        data: Object.values(feedbackCategoryCounts()),
        backgroundColor: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'],
        borderColor: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'],
        borderWidth: 1

      }
    ]
  };

  return (
    <>
      <Box sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20 }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
              >
                Manage Feedback
              </Typography>
              <TextField
                className='searchinput'
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Feedback"
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
        <Box sx={{ display: 'flex', marginTop: 2, justifyContent: 'center' }}>
          <FormControl size='small'>
            <InputLabel id="select-trainer-label">Select Trainer</InputLabel>
            <Select
              labelId="select-trainer-label"
              id="select-trainer"
              value={selectedTrainer}
              onChange={handleTrainerChange}
              style={{ backgroundColor: 'white', width: isSmallScreen ? '130px' : '150px', height: isSmallScreen ? '30px' : "40px" }}
              label="Select Trainer"
            >
              {allEmployee?.map((data) => (
                <MenuItem key={data.id} value={data?.id}>
                  {capitalizeFirstLetter(data?.fname) + " " + capitalizeFirstLetter(data?.lname)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ marginLeft: '20px' }}>
            <InputLabel id="select-course-label">Select Course</InputLabel>
            <Select
              labelId="select-course-label"
              id="select-course"
              value={selectedCourse}
              onChange={handleCourseChange}
              style={{ backgroundColor: 'white', width: isSmallScreen ? '130px' : '150px', height: isSmallScreen ? '30px' : "40px" }}
              label="Select Course"
            >
              {allCourses?.map((data) => (
                <MenuItem key={data.id} value={data?.id}>
                  {capitalizeFirstLetter(data?.CourseName)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ marginLeft: '20px' }}>
            <InputLabel id="select-batch-label">Select Batch</InputLabel>
            <Select
              labelId="select-batch-label"
              id="select-batch"
              value={selectedBatch}
              onChange={handleBatchChange}
              style={{ backgroundColor: 'white', width: isSmallScreen ? '130px' : '150px', height: isSmallScreen ? '30px' : "40px" }}
              label="Select Batch"
            >
              {allBatch?.map((data) => (
                <MenuItem key={data.id} value={data.batchname}>
                  {capitalizeFirstLetter(data.batchname)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {selectedTrainer && selectedCourse && selectedBatch && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:2 }}>
              <ResponsiveContainer width={350} height={350}>
                <Pie data={pieData} />
              </ResponsiveContainer>
            </div>
            <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Sr No</TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Student Email</TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Faculty</TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>Feedback Category</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchFeedback?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="left">
                        <strong style={{ fontSize: "28px" }}>No data found</strong>
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchFeedback.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                      const currentIndex = page * rowsPerPage + index;
                      const percentage = calculatePercentage(data);
                      const category = categorizeFeedback(percentage);

                      return (
                        <TableRow key={index}>
                          <TableCell align="left" component="th" scope="row">{currentIndex + 1}</TableCell>
                          <TableCell align="left">{capitalizeFirstLetter(data?.datetime)}</TableCell>
                          <TableCell align="left">{capitalizeFirstLetter(data?.batchwise?.student?.fname) + " " + capitalizeFirstLetter(data?.batchwise?.student?.lname)}</TableCell>
                          <TableCell align="left">{capitalizeFirstLetter(data?.batchwise?.student?.email)}</TableCell>
                          <TableCell align="left">{capitalizeFirstLetter(data?.batchwise?.batch?.course?.CourseName)}</TableCell>
                          <TableCell align="left">{capitalizeFirstLetter(data?.batchwise?.batch?.trainer?.fname) + " " + capitalizeFirstLetter(data.batchwise.batch.trainer.lname)}</TableCell>
                          <TableCell align="left">{category}</TableCell>
                          <TableCell align="center">
                            <IconButton aria-label="view">
                              <RemoveRedEyeRoundedIcon onClick={() => handleEyeIconClick(data)} style={{ color: '#2c387e', fontSize: '25px' }} />
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
                colSpan={9}
                count={searchFeedback.length}
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
          </>
        )}
        <DialogBox
          open={openDialog}
          onClose={handleCloseDialog}
          title="Trainer Feedback"
          show={showSubmitButton}
          content={
            selectedFeedback && (
              <Grid container spacing={2}>
                <Box style={{ width: "1200px" }} sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: 'background.default',
                  display: 'grid',
                  gap: 2,
                }}
                >
                  <Typography component="span" variant="subtitle1" textAlign={"left"}
                    sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 1,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                    }} >
                    <div>Student Name: {capitalizeFirstLetter(selectedFeedback?.batchwise?.student?.fname)} {capitalizeFirstLetter(selectedFeedback?.batchwise?.student?.lname)}</div>
                  </Typography>
                  <Typography component="span" variant="subtitle1" textAlign={"left"}
                    sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 1,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                    }} >
                    <div>Date: {formatDate(selectedFeedback?.datetime)}</div>
                  </Typography>
                  {parsedQA.map(({ question, answer }, index) => (
                    <Typography key={index} component="span" variant="subtitle1" textAlign={"left"}
                      sx={{
                        fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                        borderRadius: 3,
                        bgcolor: 'background.default',
                        display: 'grid',
                        gap: 0,
                        maxWidth: '800px',
                        boxShadow: 4,
                      }} >
                      <div>Que{index + 1}: {question}?</div>
                      <div>Ans: {answer}</div>
                    </Typography>
                  ))}
                </Box>
              </Grid>
            )
          }
          actionButtonText="Close"
        />
      </Box>
    </>
  );
};

export default TrainerFeedbackTable;
