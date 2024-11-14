import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { BiSolidUserCircle } from 'react-icons/bi'
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import TimerIcon from '@mui/icons-material/Timer';
import { IoMdLogOut } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import CustomAppBar from '../../../component/common/CustomAppBar';
import DialogBox from '../../../component/common/DialogBox';
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { questionActions } from '../../question/questionSliceReducer';
import { resultActions } from '../../result/resultSliceReducer';
import { Post } from '../../../services/Http.Service';
import SubmitExam from './SubmitExam';
import './Exam.css'
import { userActions } from '../../user/userSliceReducer';


const StartExam = () => {
  const [timer, setTimer] = useState(3600);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [endpage, setEndPage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);
  const [showSwitchMessage, setShowSwitchMessage] = useState(false);
  const [switchMessage, setSwitchMessage] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const { examquestion } = useSelector((store) => store.question);
  const { allExam } = useSelector((store) => store.exam);
  const { loginUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('info');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const copyrightText = `© 2017-${currentYear} Hematite Infotech, All Rights Reserved.`;
  //---------------------Prevent the context menu(inspect menu) from appearing-------------------------------//
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    Get(`${urls.loginUser}`)
      .then((response) => {
        dispatch(userActions.GetLogginUser(response.data));
      })
      .catch((error) => console.log('user error: ', error));
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await Get(urls.start_exam);
        dispatch(questionActions.getStartExamQuestion(response.data));
      } catch (error) {
        console.log("Exam error: ", error);
      }
    };

    fetchQuestions();

  }, []);

  useEffect(() => {
    setVisitedQuestions([0]);
  }, []);
  //-----------------------------------refresh page---------------------------------//
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Check if refresh action is triggered by the browser's refresh button
      event.preventDefault();
      event.returnValue = 'Do not reload the page. Exam gets submitted automatically.';
      setShowRefreshMessage(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, []);


  const handleCloseRefreshMessage = () => {
    setShowRefreshMessage(false);
  };

  //-----------------------------Tab switch--------------------------------//
  useEffect(() => {
    // Listen to page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Increment tab switch count when the page becomes hidden
        setTabSwitchCount(prevCount => prevCount + 1);
        setShowSwitchMessage(true)
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);
  //------------------------If tab switch count is 1, set timer to 0------------------------//
  useEffect(() => {

    if (tabSwitchCount === 1) {
      setTimer(0);
      setSwitchMessage(true)
    }
  }, [tabSwitchCount]);

  const handleCloseSwitchMessage = () => {
    setShowSwitchMessage(false);
  };

  //-------------------------------------Disable keybord key---------------------------//
  const handleKeyDown = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  //-------------------------------disable back button----------------------------------------//
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault(); // Prevent default behavior
      navigate('/start-exam'); // Redirect to the desired page
    };

    window.history.pushState(null, '', window.location.pathname); // Ensure that the user can't go back using browser back button
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);
  //---------------------------------------get question and set timer---------------------------//
  useEffect(() => {
    if (allExam.length === 0) {
      return;
    }

    const examId = sessionStorage.getItem('examId');
    const parsedExamId = Number(examId);
    const selectedExam = allExam.find(exam => exam.id === parsedExamId);

    if (!selectedExam) {
      return;
    }

    const studentName = `${loginUser?.fname} ${loginUser?.lname}`;

    if (studentName) {
      setStudentName(studentName);
    }

    let examTimeInSeconds = 0;

    if (selectedExam) {
      let examTime = selectedExam.examTime.toLowerCase();
      if (examTime.endsWith('min')) {
        const minutes = parseInt(examTime);
        examTimeInSeconds = minutes * 60;
      } else if (examTime.endsWith('hr')) {
        const hours = parseInt(examTime);
        examTimeInSeconds = hours * 3600;
      }
    }

    setTimer(examTimeInSeconds);

    const totalQuestions = selectedExam.totalQuestion;

    const filterQuestions = examquestion && examquestion.filter((val) => val.exam.id === selectedExam.id);
    const shuffledQuestions = shuffleArray(filterQuestions);
    const slicedQuestions = shuffledQuestions.slice(0, totalQuestions); // Shuffle the questions
    setQuestions(slicedQuestions);

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        const updatedTimer = Math.max(0, prevTimer - 1);
        return updatedTimer;
      });
    }, 1000);
    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [examquestion, allExam]);

  //---------------------------------- Function to shuffle an array--------------------------//
  const shuffleArray = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  //-------------------------------------next and previous button------------------------//
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      if (!visitedQuestions.includes(currentQuestionIndex + 1)) {
        setVisitedQuestions(prevVisited => [...prevVisited, currentQuestionIndex + 1]);
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      if (!visitedQuestions.includes(currentQuestionIndex - 1)) {
        setVisitedQuestions(prevVisited => [...prevVisited, currentQuestionIndex - 1]);
      }
    }
  };

  //-------------------------------Format time-------------------------------------------//
  const formatTimer = timer => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  //------------------------------Input change handler-----------------------------------//
  const inputChangeHandler = (event, id) => {
    const { value } = event.target;
    const index = questions.findIndex(x => x.id === id);

    if (index !== null && index >= 0) {
      answerQuestion(value, id) // Set the selected option as the answer
    }

    const updatedSelectedOptions = selectedOptions.filter(
      option => option.questionIndex !== index
    );
    updatedSelectedOptions.push({
      questionIndex: index,
      optionValue: value,
    });
    setSelectedOptions(updatedSelectedOptions);
  };

  const answerQuestion = (value, id) => {
    const index = questions.findIndex(que => que.id === id);
    if (index !== -1) {
      const updatedQuestions = [...questions];
      const optionKey = Object.keys(updatedQuestions[index]).find(key => updatedQuestions[index][key] === value);
      if (optionKey) {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          answer: optionKey // Store the key of the selected option
        };
        setQuestions(updatedQuestions);
      }
    }
  };



  //-------------------------------Handle chip----------------------------------------//
  const handleChipClick = (index) => {
    setCurrentQuestionIndex(index);
    if (!visitedQuestions.includes(index)) {
      setVisitedQuestions(prevVisited => [...prevVisited, index]);
    }
  };

  //------------------------------------handle dialog box-----------------------------//  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  //-------------------------------------Logout--------------------------------------//
  const handleLogout = () => {
    const isAnyAnswerBlank = checkBlankAnswers(questions);

    if (isAnyAnswerBlank && timer > 0) {
      setOpenSnackbar(true);
      return;
    } else {
      setAlertSeverity('warning'); // or 'info', 'error', etc. based on your needs
      setAlertMessage(`Are you sure you want to logout ?`);
      setShowAlert(true);

    }
  };
  //-----------------------------Check blank anwers------------------------------------//
  const checkBlankAnswers = (questions) => questions.some((que) => !que.answer || que.answer === "");

  //----------------------------Submit exam-------------------------------------------//
  const submitExam = () => {
    const isAnyAnswerBlank = checkBlankAnswers(questions);

    if (isAnyAnswerBlank && timer > 0) {
      setOpenSnackbar(true);
      return;
    }

    const examId = sessionStorage.getItem('examId');
    const studentId = loginUser?.id
    const isShow = sessionStorage.getItem('showResult')
    console.log(isShow);

    const req = {
      exam_id: examId,
      student_id: studentId,
      questions: questions,
    }

    Post(urls.submit_exam, req)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          dispatch(resultActions.addResult(response.data));
        }

      })
      .catch((error) => {
        setAlertSeverity('error'); // or 'info', 'error', etc. based on your needs
        setAlertMessage(error?.message);
        setShowAlert(true);
      });

    if (!examSubmitted) {
      setExamSubmitted(true);
      setOpenSnackbar(false);
      if (isShow == 'true') {
        navigate('/question-answer', { state: { req } })
      } else {
        sessionStorage.clear();
        navigate('/exam-submitted');
      }
    }

    setEndPage(true);

  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Please solve all questions"
        action={
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
      <Snackbar
        open={showRefreshMessage}
        autoHideDuration={9000}
        onClose={handleCloseRefreshMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="You refreshed the exam page. Please click the Submit button and contact the admin."
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleCloseRefreshMessage}>
              Close
            </Button>
          </React.Fragment>
        }
      />
      <Snackbar
        open={showSwitchMessage}
        autoHideDuration={9000}
        onClose={handleCloseSwitchMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Warning:Please do not switch tabs.Don't do again."
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleCloseSwitchMessage}>
              Close
            </Button>
          </React.Fragment>
        }
      />
      {endpage ? (
        navigate('/exam-submitted')
      ) : (
        <div>

          <Box sx={{}}>
            <AppBar color='primary' position="fixed">
              <Toolbar>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BiSolidUserCircle style={{ fontSize: '25px' }} />
                    <Typography style={{ fontFamily: "ubuntu", fontSize: isSmallScreen ? '14px' : '20px', marginLeft: '10px' }}>Welcome, {studentName}</Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon style={{ fontSize: '25px', marginRight: '10px' }} />
                    <Typography style={{ fontFamily: "ubuntu", fontSize: isSmallScreen ? '14px' : '20px' }}>{formatTimer(timer)}</Typography>
                    <Typography style={{ fontFamily: "ubuntu", fontSize: isSmallScreen ? '14px' : '20px', marginLeft: '10px' }}>|</Typography>
                    <Button sx={{ marginLeft: '15px' }} onClick={handleLogout} size='small' variant='outlined' color="inherit" >
                      Logout
                    </Button>
                  </div>

                </div>
              </Toolbar>
            </AppBar>
          </Box>



          {timer > 0 ? (
            <div className='chip' style={{ display: 'inline-list-item' }}>
              <Chip
                color='warning'
                label='Visited'
                sx={{ minWidth: '30px', height: '30px', fontSize: '12px' }}
              />

              <Chip
                color='primary'
                label='Current'
                sx={{ minWidth: '30px', height: '30px', fontSize: '12px', marginLeft: 2 }}
              />
              <Chip
                color='success'
                label='Answered'
                sx={{ minWidth: '30px', height: '30px', fontSize: '12px', marginLeft: 2 }}
              />
            </div>

          ) : null}

          <Box sx={{ padding: 5, display: "flex", flexDirection: "column", flexWrap: "wrap", width: "auto" }}>
            {timer > 0 ? (
              <Typography sx={{ fontSize: isSmallScreen ? '14px' : '20px' }} gutterBottom>
                Questions
              </Typography>
            ) : null}

            {timer == 0 ? (
              <Box sx={{ marginBottom: '20px', padding: '20px', marginTop: '20px', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: "20px", }} variant="h6" color='secondary' gutterBottom>
                  {switchMessage ?
                    "You try to switch the browser tab.Please click on submit button." :
                    "Time is over...Please click on submit button"
                  }
                </Typography>
              </Box>
            ) : null}

            {timer > 0 && questions && questions.length > 0 && currentQuestionIndex < questions.length ? (
              <Box sx={{ marginBottom: '20px', padding: '20px', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: "20px", textAlign: 'left' }} variant="h6" gutterBottom>
                  {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
                </Typography>
                {questions[currentQuestionIndex].questionImage && (
                  <div style={{ display: 'flex', height: '400px', width: '400px', marginTop: '10px', objectFit: 'cover' }}>
                    <img src={questions[currentQuestionIndex].questionImage} alt="Question Image" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                  </div>
                )}
                <div style={{ display: 'flex' }}>
                  <RadioGroup
                    aria-label={`question-${currentQuestionIndex}`}
                    name={`question-${currentQuestionIndex}`}
                    value={selectedOptions.find(option => option.questionIndex === currentQuestionIndex)?.optionValue || ''}
                    onChange={(e) => inputChangeHandler(e, questions[currentQuestionIndex].id)}
                  >
                    {/* Render only two options if there are two options present */}
                    {Object.keys(questions[currentQuestionIndex]).map(key => {
                      if (key.startsWith('option') && questions[currentQuestionIndex][key]) {
                        return (
                          <FormControlLabel
                            key={key}
                            value={questions[currentQuestionIndex][key]}
                            control={<Radio />}
                            label={questions[currentQuestionIndex][key]}
                          />
                        );
                      }
                      return null;
                    })}
                  </RadioGroup>

                </div>
                {!isFirstQuestion && (
                  <Button variant="contained" color="primary" onClick={goToPreviousQuestion} sx={{ marginRight: '10px' }}>
                    Previous
                  </Button>
                )}
                {!isLastQuestion && (
                  <Button variant="contained" color="primary" onClick={goToNextQuestion} sx={{ marginRight: '10px' }}>
                    Next
                  </Button>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '5px' }}>
                  {questions.map((id, index) => (
                    <Chip
                      key={id}
                      label={`${index + 1}`}
                      color={
                        selectedOptions.some(option => option.questionIndex === index) ? 'success' :
                          currentQuestionIndex === index ? 'primary' :
                            visitedQuestions.includes(index) ? 'warning' : 'default'
                      }
                      onClick={() => handleChipClick(index)}
                      sx={{ minWidth: '30px', height: '30px', fontSize: '12px' }}
                    />
                  ))}
                </Box>
              </Box>
            ) : null}

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '27px', overflowX: 'auto', overflowY: 'auto' }}>

              <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
                Submit Exam
              </Button>

            </Box>
          </Box>

          <DialogBox
            open={openDialog}
            onClose={handleCloseDialog}
            show={true}
            onConfirm={() => {
              handleCloseDialog();
              submitExam();
            }}
            message={`Are you sure you want to submit the exam?`}
            title={`Confirmation`}
            submitLabel={`submit`}
          />
          <DialogBox
            open={showAlert}
            onClose={() => setShowAlert(false)}
            show={true}
            onConfirm={() => {
              setShowAlert(false);
              sessionStorage.removeItem("role");
              sessionStorage.removeItem("studentId");
              sessionStorage.removeItem("examId");
              sessionStorage.removeItem("Voucher");
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("accessToken");
              navigate("/");
            }}
            title={`Confirmation`}
            message={alertMessage}
            submitLabel={`Logout`}
          />
        </div>
      )}
      <CustomAppBar title={copyrightText} />
    </>
  );
};



export default StartExam;
