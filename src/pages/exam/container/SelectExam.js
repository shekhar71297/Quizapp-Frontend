import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Instructions from './Instructions';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { examActions } from '../examSliceReducer';
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';


function SelectExam() {
  const [examId, setExamId] = useState('');
  const [showInstruction, setShowInstruction] = useState(false);
  const { allExam } = useSelector((store) => store.exam);
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    Get(urls.exams).then(response => {
      const reversedexam = response.data.reverse(); // Reverse the array of users
      dispatch(examActions.GET_EXAM(reversedexam));
    })
      .catch(error => console.log("Exam error: ", error));
  }, []);

  const activeExams = allExam.filter(exam => exam.examStatus);

  const handleChange = (event) => {
    setExamId(parseInt(event.target.value, 10));
  };
  const filterresult = allExam.some(exam => exam.id == examId && exam.showResult== true)
  console.log(filterresult);
  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const submitBtn = () => {
    if(filterresult){
      sessionStorage.setItem('showResult',true)
    }else{
      sessionStorage.setItem('showResult',false)
    }
    
    if (examId) {
      sessionStorage.setItem('examId', examId);
      setShowInstruction(true);
    } else {
      openSnackbar('Please select an exam before proceeding.');
    }
  };

  return (
    <div>
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="warning">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {showInstruction ? (
        <Instructions />
      ) : (
        <>
          <Container component="main" maxWidth="xs">
            <CssBaseline />

            <Box
              sx={{ boxShadow: '0px 0px 7px black', marginTop: 10, }}
              borderRadius={2}
              p={3}
              textAlign="center"
            >
              <Typography sx={{ color: 'primary.main', fontSize: isSmallScreen ? '18px' : '20px' }}>
                Select Exam
              </Typography>

              <FormControl fullWidth sx={{ mt: 1 }} size='small'>
                <InputLabel id="demo-simple-select-label">Select Exam</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={examId}
                  label="select Exam"
                  name='exam'
                  autoWidth
                  onChange={handleChange}

                >
                  <MenuItem sx={{ width: isSmallScreen ? '240px' : '345px'}} >None</MenuItem>
                  {activeExams.map(exam => (
                    <MenuItem key={exam.id} value={exam.id}  >{capitalizeFirstLetter(exam.examName)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={submitBtn}
              >
                submit
              </Button>
            </Box>

          </Container>
        </>
      )}
    </div>
  );
}

export default SelectExam;
