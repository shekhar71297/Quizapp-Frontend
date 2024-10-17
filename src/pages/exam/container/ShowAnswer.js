import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppBar, Toolbar } from '@mui/material';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@mui/material/IconButton';
import { IoMdLogOut } from 'react-icons/io';
import Button from '@mui/material/Button';
import './Exam.css';
import logoimg from '../../../asset/img/Hematite Logo.jpg';
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../../../component/common/CustomAppBar';
import DialogBox from '../../../component/common/DialogBox';
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { examActions } from '../examSliceReducer';
import { useDispatch, useSelector } from 'react-redux';
import { questionActions } from '../../question/questionSliceReducer';

function ShowAnswer({ req }) {
  const { exam_id, student_id, questions } = req;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const copyrightText = `© 2017-${currentYear} Hematite Infotech, All Rights Reserved.`;
  const nav = useNavigate()
  const dispatch = useDispatch();
  const { allquestions } = useSelector((store) => store.question);
  const { allExam } = useSelector((store) => store.exam);
  const [collectedData, setCollectedData] = useState([]);
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
  }, []);

  const closePage = () => {
    sessionStorage.clear()
    nav('/exam-submitted')
  }
  const handleLogout = () => {
    setAlertSeverity('warning'); // or 'info', 'error', etc. based on your needs
    setAlertMessage(`Are you sure you want to logout ?`);
    setShowAlert(true);
  };

  useEffect(() => {
    if (allExam.length && allquestions.length) {
      const filterExamId = allExam
        .filter(exam => exam.id == exam_id) // Filter exams by matching exam_id
        .map(exam => exam.id)        // Map to get the examCode
        .join(", ");

      const filterQuestionId = questions
        .map(q => q.id)        // Map to get the question ids
        .join(", ");

      // console.log("Filtered Exam Code:", filterExamCode);
      // console.log("Filtered Question IDs:", filterQuestionId);

      const filteredQuestions = allquestions.filter(question =>
        filterExamId.includes(question.exam.id) &&
        filterQuestionId.includes(question.id)
      );
      console.log(filteredQuestions);


      const collectedData = filteredQuestions.map(question => ({
        id: question.id,
        answerKey: question.answer // Assuming 'correctAnswer' holds the answer key
      }));
      console.log(collectedData);

      // console.log("Collected Data:", collectedData);

      setCollectedData(collectedData);
    }
  }, [allExam, allquestions, exam_id, questions]);

  const getOptionBackgroundColor = (questionId, option) => {
    const questionData = collectedData.find(q => q.id === questionId);
    const submittedAnswer = questions.find(q => q.id === questionId)?.answer;

    if (!questionData) {
      return {}; // If no matching question data, return empty object.
    }

    if (questionData.answerKey === option) {
      // Correct answer should be green
      return { backgroundColor: 'lightgreen' };
    }

    if (submittedAnswer === option && submittedAnswer !== questionData.answerKey) {
      // Submitted answer is wrong, highlight in red
      return { backgroundColor: 'lightcoral' };
    }

    return {}; // Default background color for other options.
  };


  return (
    <div>
      <AppBar color='primary' position="sticky">
        <Toolbar>
          <div style={{ display: 'flex', marginRight: '10px' }}>
            <img
              style={{
                width: isSmallScreen ? '40px' : "50px",
                height: isSmallScreen ? '36px' : "46px",
                borderRadius: "64%",
                boxShadow: "white 0px 0px 6px -1px"
              }}
              src={logoimg}
              alt="logoimg"
            />
          </div>
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              width: '90px',
              fontSize: isSmallScreen ? '13px' : '20px'
            }}>
            Hematite Infotech Online-Quiz
          </Typography>
          <Button sx={{ marginLeft: '15px' }} onClick={handleLogout} size='small' variant='outlined' color="inherit" >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {questions && questions.map((question, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ textAlign: 'left' }} spacing={2}>
              <Grid item xs={8}>
                <Typography sx={{ fontSize: '18px' }}>
                  Que {index + 1} : {question.question}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <div style={{ position: 'relative', left: "30%", color: '#2c387e' }}>
                  {question.marks} Marks
                </div>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {question.questionImage && (
              <img src={question.questionImage} alt={`Question ${index + 1}`} />
            )}
            <ul>
              <li
                className='option-list'
                style={getOptionBackgroundColor(question.id, 'option1')}
              >
                Option 1: {question.option1}
              </li>
              <li
                className='option-list'
                style={getOptionBackgroundColor(question.id, 'option2')}
              >
                Option 2: {question.option2}
              </li>
              <li
                className='option-list'
                style={getOptionBackgroundColor(question.id, 'option3')}
              >
                Option 3: {question.option3}
              </li>
              <li
                className='option-list'
                style={getOptionBackgroundColor(question.id, 'option4')}
              >
                Option 4: {question.option4}
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className='close-btn' style={{ marginBottom: '80px' }}>
        <Button type='button' variant='contained' size='small' onClick={closePage}>
          Close
        </Button>
      </div>
      <CustomAppBar title={copyrightText} />
      <DialogBox
        open={showAlert}
        onClose={() => setShowAlert(false)}
        show={true}
        onConfirm={() => {
          setShowAlert(false);
          sessionStorage.clear();
          nav('/exam-submitted')
        }}
        title={`Confirmation`}
        message={alertMessage}
        submitLabel={`Logout`}
      />
    </div>
  );
}

export default ShowAnswer;