import React from 'react'
import './PageNotFound.css'; 
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const nav = useNavigate();
  const handleLoginClick = () => {
    nav('/'); // Navigate to the feedback form page
  };
  return (
    <body>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
      <script src="https://kit.fontawesome.com/4b9ba14b0f.js" crossOrigin="anonymous"></script>
      <div class="mainbox">
        <div class="err">4</div>
        <i class="far fa-question-circle fa-spin"></i>
        <div class="err2">4</div>
        <div class="msg">Oops...? Somthings went's wrong !<p style={{color:'red'}}>Error:404 Page Not Found </p> <p >Press Login button to return to the Login page. <Button variant='outlined' color='error' component='button' onClick={handleLoginClick} >Login</Button> and try from there.</p></div>
      </div>
    </body>
  )
}

export default PageNotFound
