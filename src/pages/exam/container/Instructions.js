import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogBox from '../../../component/common/DialogBox';
import StartExam from './StartExam';
import SelectExam from './SelectExam';


export default function Instructions({ }) {
  const [showQuiz, setShowQuiz] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [back, setBack] = React.useState(false);

//----------------------------------------Start button--------------------------------//
  const handleStartClick = () => {
    setShowQuiz(true);
  };

  //--------------------------------------Back button--------------------------------//
  const handleBackClick = () => {
    setBack(true);
  };

  return (
    <div>
      {back ? (
        <SelectExam />
      ) : (
        <>
          {showQuiz ? (
            <StartExam />
          ) : (
            <>
              <Card sx={{ maxWidth: 345, margin: "auto", marginTop: 10, boxShadow: '0px 0px 7px black', borderRadius: "10px", }}>
                <CardContent>
                  <Typography sx={{ color: 'primary.main', fontSize: isSmallScreen ? '18px' : '20px' }} gutterBottom variant="h5" component="div">
                    Instructions
                  </Typography>
                  <Typography align='left' variant="body2" color="red">
                    <ul>
                      <h4>Follow the Below Instruction</h4>
                      <li>Do not refresh the page</li>
                      <li>Do not use keyboard</li>
                      <li>Exam will be automatically submit after time is over</li>
                      <li>Do not open another tab </li>
                    </ul>
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', flex: 'row', justifyContent: 'space-around' }} >
                  <Button variant='text' color='primary' size='small' onClick={handleBackClick}>Back</Button>
                  <Button variant='text' color='primary' size='small' onClick={handleStartClick}>Start Exam</Button>
                </CardActions>
              </Card>
            </>
          )}
        </>
      )}
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
  );
}
