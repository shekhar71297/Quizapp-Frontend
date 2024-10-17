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
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Box, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import { formatDate } from '../../../component/common/DateFormat'
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { resultActions } from '../resultSliceReducer';
import { examActions } from '../../exam/examSliceReducer';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const ResultModule = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const { allresult, allBatchWiseStudent, allBatch } = useSelector((store) => store.result);
  const dispatch = useDispatch();
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const { allExam } = useSelector((store) => store.exam);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [show, setShow] = useState(false)


  useEffect(() => {
    Get(urls.result)
      .then((response) => {
        const reversedResult = response.data.reverse();
        dispatch(resultActions.getResult(reversedResult));
      })
      .catch((error) => console.log("result error: ", error));
  }, []);

  useEffect(() => {

  }, [selectedBatch]);

  useEffect(() => {
    Get(urls.batch).then(response => {
      const reverseBatch = response.data.reverse();
      dispatch(resultActions.getBatch(reverseBatch));
    }).catch((error) => {
      console.error('Error fetching batch:', error);
    });
  }, []);

  useEffect(() => {
    Get(urls.exams)
      .then((response) => {
        const reversedData = response.data.reverse(); // Reverse the array of users
        dispatch(examActions.GET_EXAM(reversedData));
      })
      .catch((error) => console.log("Exam error: ", error));
  }, []);

  useEffect(() => {
    Get(urls.batchWiseStudent).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(resultActions.getBatchWiseStudent(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);

  useEffect(() => {
    Get(urls.batchWiseStudent).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(resultActions.getBatchWiseStudent(reverseFeedback));
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, [selectedBatch]);

  // useEffect to update the table when batch, exam, or date changes





  //---------------------------handle pagination-----------------------//
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

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setPage(0);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setPage(0);
  };
  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setPage(0);
  };

  const calculateChartData = () => {
    const filteredResults = filteredResult.filter((data) => {
      const examFilter = selectedExam ? data?.exam?.examName === selectedExam : true;
      const dateFilter = selectedDate ? data?.date == selectedDate : true;
      return examFilter && dateFilter;
    });

    const totalStudents = filteredResults.length;
    const passStudents = filteredResults.filter((result) => result.status === 'pass').length;
    const failStudents = totalStudents - passStudents;

    const passPercentage = totalStudents > 0 ? (passStudents / totalStudents) * 100 : 0;
    const failPercentage = totalStudents > 0 ? (failStudents / totalStudents) * 100 : 0;

    return [
      { name: 'Pass', value: passPercentage },
      { name: 'Fail', value: failPercentage }
      // { name: 'Total', value: totalStudents }
    ];
  };

  // Function to format the label for the chart
  const renderCustomizedLabel = ({ name, value }) => {
    return `${value.toFixed(2)}%`;
  };

  const handlePieClick = (entry) => {
    let filteredData;
    if (entry.name === 'Pass') {
      filteredData = filteredResult.filter(data => data.status === 'pass' && data.date == selectedDate && data.exam.examName === selectedExam);
      setShow(true)
      console.log("click on pass:", filteredData);
    } else if (entry.name === 'Fail') {
      filteredData = filteredResult.filter(data => data.status === 'fail' && data.date == selectedDate && data.exam.examName === selectedExam);
      console.log("click on fail:", filteredData);
      setShow(true)
    } else {
      filteredData = filteredResult.filter((data) => {
        const examFilter = selectedExam ? data.exam.examName === selectedExam : true;
        const dateFilter = selectedDate ? data.date == selectedDate : true;
        console.log(selectedDate);
        return examFilter && dateFilter;
        setShow(true)

      });;
    }

    setMapData(filteredData);
  };




  const renderPieChart = () => {
    if (!selectedExam || !selectedDate || filteredResult.length === 0) {
      return null; // Don't render pie chart if exam or date is not selected or if no data found
    }

    const data = calculateChartData();

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={calculateChartData()}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={renderCustomizedLabel} // Custom label to show percentage with %
            onClick={handlePieClick}
          >
            {calculateChartData().map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === 'Pass' ? '#82ca9d' : '#ff5733'}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
        </PieChart>
      </div>
    );
  };
  console.log(allBatchWiseStudent);
  console.log(selectedBatch);


  const fillterBatchWiseStudentData = allBatchWiseStudent?.filter((data) => data.batch.id == selectedBatch);
  console.log(fillterBatchWiseStudentData);


  const filteredResult = allresult.filter((data) => {
    const examFilter = selectedExam ? data?.exam?.examName === selectedExam : true;
    const dateFilter = selectedDate ? data.date == selectedDate : true;
    const batchFilter = fillterBatchWiseStudentData.some(batchStudent => batchStudent.student.id === data.student.id); // Filter by student ID
    return examFilter && dateFilter && batchFilter;
  });
  console.log(filteredResult);



  const [mapData, setMapData] = useState(filteredResult);
  console.log('filteredResult', filteredResult);

  useEffect(() => {
    setShow(false)
  }, [selectedBatch]);

  const user = allresult && allresult.length > 0 && allresult.some((val) => val?.exam?.examName === selectedExam && val.date === selectedDate);


  return (
    <div>

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
                Result
              </Typography>

              {/* <TextField
                className='searchinput'
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Result"
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
              /> */}

            </Toolbar>
          </AppBar>
        </Box>
        <div style={{ padding: '20px' }} >
          <FormControl size='small' >
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
                <MenuItem key={data.id} value={data.id}>
                  {capitalizeFirstLetter(data.batchname)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size='small' sx={{ marginLeft: '10px' }} >
            <InputLabel id="demo-simple-select-autowidth-label" >Select Exam</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth-label"
              value={selectedExam}
              onChange={handleExamChange}
              style={{ backgroundColor: 'white', width: isSmallScreen ? '130px' : '150px', height: isSmallScreen ? '30px' : "40px" }}
              label="Select Exam"
            >

              {allExam && allExam.length > 0 && allExam.map((exam) => (
                <MenuItem key={exam.id} value={exam?.examName}>
                  {capitalizeFirstLetter(exam?.examName)}
                </MenuItem>
              ))}

            </Select>
          </FormControl>

          <TextField
            type="date"
            label="Date"
            value={selectedDate}
            onChange={handleDateChange}
            variant="outlined"
            size='small'
            sx={{
              backgroundColor: 'white',
              borderRadius: "4px",
              marginLeft: '10px',
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        {user && (
          <CardContent sx={{ borderRadius: 'none' }}  >

            {renderPieChart()}
            {user && show && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePieClick}
                  style={{ float:'right'}}
                >
                  Show Total Students 
                </Button>
                <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Sr No</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Student Email</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Exam Name</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Exam Date</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Obtained Marks</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Total Marks</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Grade</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mapData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align='left'>
                            <strong style={{ fontSize: "34px" }}>No data found</strong>

                          </TableCell>
                        </TableRow>
                      ) : (
                        mapData && mapData.length > 0 && mapData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                          const currentIndex = page * rowsPerPage + index + 1;
                          return (
                            <TableRow key={data.id}>
                              <TableCell align="left" component="th" scope="row">{currentIndex}</TableCell>
                              <TableCell align="left">{capitalizeFirstLetter(data?.student?.fname) + " " + capitalizeFirstLetter(data.student.lname)} </TableCell>
                              <TableCell align="left">{data?.student?.email}  </TableCell>
                              <TableCell align="left">{capitalizeFirstLetter(data?.exam?.examName)} </TableCell>
                              <TableCell align="left">{formatDate(data?.date)} </TableCell>
                              <TableCell align="left">{data?.obtainedmark} </TableCell>
                              <TableCell align="left">{data?.totalmark} </TableCell>
                              <TableCell align="left">{data?.grade} </TableCell>
                              <TableCell align="left">{capitalizeFirstLetter(data?.status)} </TableCell>
                            </TableRow>
                          )
                        }) || [])}
                    </TableBody>
                  </Table>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={7}
                    count={filteredResult.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions.default}
                  />
                </TableContainer>
              </>
            )}
          </CardContent>
        )}
      </Card>

    </div >
  );
}

export default ResultModule;
