import * as React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {IoIosCheckmarkCircle } from 'react-icons/io';
import { Link } from '@mui/material';

export default function SubmitExam() {
  const navigate = useNavigate(); // Initialize useNavigate
  // After 3 seconds, navigate to the login page
  // React.useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     navigate('/'); // Replace with your login route
  //   }, 3000);

  //   // Clear the timeout if the component unmounts
  //   return () => clearTimeout(timeoutId);
  // }, []);

  return (
        <> 
         <Card sx={{ maxWidth: 345,margin:"auto",marginTop:10,borderRadius:10, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" color="primary" component="div">
        Exam Submitted Successfully
        </Typography>
        <Typography align='center' variant="h1" color="primary">
          
           <IoIosCheckmarkCircle/>
        </Typography>
      </CardContent>
    </Card>
    <Typography align="center" variant="body2" color="secondary" sx={{ marginTop: 3 }}>
            <Link href="#" onClick={() => navigate('/student-feedback')} underline="hover"
            sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Click here to give feedback
            </Link>
          </Typography>
    </>
  );
}