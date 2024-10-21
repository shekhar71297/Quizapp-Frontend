
import * as React from 'react';
import './dashboard.css'
import { FaUsers } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { PiExamFill } from 'react-icons/pi';
import { MdGeneratingTokens } from 'react-icons/md';
import { GiPapers } from 'react-icons/gi';
import { MdFeedback } from 'react-icons/md';
import { RiNewspaperFill } from 'react-icons/ri';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';
import  { FaAddressBook } from "react-icons/fa"; 
import { IoMdPersonAdd } from "react-icons/io";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DialogBox from '../../component/common/DialogBox';
import { Button } from '@mui/material';
import { capitalizeFirstLetter } from '../../component/common/CapitalizeFirstLetter';
import { useDispatch, useSelector } from 'react-redux';
import { feedbackAnsActions } from '../trainerFeedback/trainerSliceReducer';
import { Get } from '../../services/Http.Service';
import { urls } from '../../utils/constant';
import { useEffect } from 'react';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


const ControlPanel = () => {

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [ShowScheduledAlert, setShowScheduledAlert] = React.useState(false);

  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('info');
  const navigate = useNavigate();
  const location = useLocation();
  const isRole = sessionStorage.getItem("role") === "admin";
  const isCounsellor = sessionStorage.getItem("role") === "counsellor"
  const role = sessionStorage.getItem('role')
  const userName = sessionStorage.getItem("user");
  const dispatch = useDispatch();
  const { allScheduledFeedback, } = useSelector((store) => store.feedbackAns);
  const [sentEmail, setSentEmail] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [oldDate, setOldDate] = React.useState("0000-00-00")

  useEffect(() => {
    Get(urls.scheduled)
      .then(response => {
        const reverseFeedback = response.data.reverse();
        console.log('Fetched Feedback:', reverseFeedback);
        dispatch(feedbackAnsActions.getScheduledFeedback(reverseFeedback));
      })
      .catch(error => {
        console.error('Error fetching feedback:', error);
      });
  }, []);
  console.log(currentDate);

  useEffect(() => {
    const newDate = new Date().toISOString().slice(0, 10);
    setCurrentDate(newDate);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (oldDate !== currentDate) {
        setOldDate(currentDate) // Update the current date
        setSentEmail(true); // Reset sentEmail to false when the date changes
      } else {
        setSentEmail(false)
      }
    }, 1000); // Check every minute

    
  }, [currentDate]);

  // useEffect(() => {
  //   console.log('All Scheduled Feedback:', allScheduledFeedback);
  //   if (allScheduledFeedback.length > 0) {
  //     checkTodayScheduledFeedback(allScheduledFeedback);
  //   }
  // }, [sentEmail]);


  if (sentEmail == true && isRole) {
    setSentEmail(false)
    console.log('Feedback List for Check:', allScheduledFeedback);
    const today = new Date().toISOString().slice(0, 10);
    console.log('Today\'s Date:', today);
    const feedbackKeys = ['feedback1', 'feedback2', 'feedback3', 'feedback4'];
    let foundPending = false;

    allScheduledFeedback.forEach(feedback => {
      feedbackKeys.forEach((key, index) => {
        if (feedback[key] && feedback[key].includes(today) && feedback[`status${index + 1}`] === 'pending') {
          console.log('Found Pending Feedback:', feedback);
          foundPending = true;
          setSentEmail(false)
        }
      });
    });

    if (foundPending) {
      setAlertSeverity('info');
      setAlertMessage(`Feedack mail send successfully as per the scheduled date`);
      setShowScheduledAlert(true);
    }
  };

  const handleConfirmation = () => {
    setShowScheduledAlert(false);
    navigate("/dashboard/schedule");
  };

  //------------------------------------------Handle Drawer---------------------------------//
  const handleDrawerClose = () => {
    setOpen(false);
  };
  //------------------------------------Navigate to specific path--------------------------//
  const navigatePage = (path) => {
    navigate(path)
  }
  //-------------------------------------------Logout--------------------------------------//
  const handleLogout = () => {
    setAlertSeverity('warning'); // or 'info', 'error', etc. based on your needs
    setAlertMessage(`Are you sure you want to logout as ${role}?`);
    setShowAlert(true);
  };

  return (

    <>

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"

            >
              <GiHamburgerMenu />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: '18px' }} noWrap component="div">
              Hematite Infotech Pvt Ltd  <span style={{ marginLeft: '15px', marginRight: '15px' }}>|</span>  {capitalizeFirstLetter(role)} Dashboard
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {userName ? (
              <Typography variant="h6" noWrap sx={{ fontSize: '18px' }} component="div">
                Welcome  {userName}
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ fontSize: '18px' }} noWrap component="div">
                Dashboard
              </Typography>
            )}
            <Typography sx={{ marginLeft: '15px' }} variant="h6" noWrap component="div">
              |
            </Typography>
            <Button sx={{ marginLeft: '15px' }} onClick={handleLogout} size='small' variant='outlined' color="inherit" >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />

           <List>
          {/*-----------------------------------student module-------------------------------------- */}

              <ListItem
                disablePadding
                sx={{ display: 'block' }}
                className={location.pathname === '/dashboard/student' ? 'selected' : ''}
              >
                <ListItemButton onClick={() => navigatePage("/dashboard/student")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Tooltip title="Student">
                      <IconButton>
                        <FaUsers style={{ color: '#2c387e', fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText className='menu-color' primary='Student' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>

           {/*-----------------------------------Enrollment details module-------------------------------------- */}
           {(isRole || isCounsellor) && (
              <ListItem
             disablePadding
             sx={{ display: 'block' }}
             className={location.pathname === '/dashboard/register-student' ? 'selected' : ''}
           >
             <ListItemButton onClick={() => navigatePage("/dashboard/register-student")}
               sx={{
                 minHeight: 48,
                 justifyContent: open ? 'initial' : 'center',
                 px: 2.5,
               }}
             >
               <ListItemIcon
                 sx={{
                   minWidth: 0,
                   mr: open ? 2 : 'auto',
                   justifyContent: 'center',
                 }}
               >
                 <Tooltip title="Register Student">
                   <IconButton>
                     <IoMdPersonAdd style={{ color: '#2c387e', fontSize: '20px' }} />
                   </IconButton>
                 </Tooltip>
               </ListItemIcon>
               <ListItemText className='menu-color' primary='Register Student' sx={{ opacity: open ? 1 : 0 }} />
             </ListItemButton>
           </ListItem>
           )}
             {/*-----------------------------------Enquiry details module-------------------------------------- */}
             {(isRole || isCounsellor) && (
             <ListItem
             disablePadding
             sx={{ display: 'block' }}
             className={location.pathname === '/dashboard/enquiry' ? 'selected' : ''}
           >
             <ListItemButton onClick={() => navigatePage("/dashboard/enquiry")}
               sx={{
                 minHeight: 48,
                 justifyContent: open ? 'initial' : 'center',
                 px: 2.5,
               }}
             >
               <ListItemIcon
                 sx={{
                   minWidth: 0,
                   mr: open ? 2 : 'auto',
                   justifyContent: 'center',
                 }}
               >
                 <Tooltip title="enquiry">
                   <IconButton>
                     <FaAddressBook style={{ color: '#2c387e', fontSize: '20px' }} />
                   </IconButton>
                 </Tooltip>
               </ListItemIcon>
               <ListItemText className='menu-color' primary='Enquiry' sx={{ opacity: open ? 1 : 0 }} />
             </ListItemButton>
           </ListItem>
             )}
            {/*-------------------------------------Batch Module-----------------------------*/}
              <ListItem
                disablePadding
                sx={{ display: "block" }}
                className={
                  location.pathname === "/dashboard/batch" ? "selected" : ""
                }
              >
                <ListItemButton
                  onClick={() => navigatePage("/dashboard/batch")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Batch">
                      <IconButton>
                        <DashboardIcon style={{ color: "#2c387e", fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText className='menu-color' primary="Batch" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            {/*-----------------------------------Staff module--------------------------- */}
            {isRole && (
              <ListItem
                disablePadding
                sx={{ display: 'block' }}
                className={location.pathname === '/dashboard/staff' ? 'selected' : ''}
              >
                <ListItemButton onClick={() => navigatePage("/dashboard/staff")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Tooltip title="Employee">
                      <IconButton>
                        <PersonIcon style={{ color: '#2c387e', fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText className='menu-color' primary='Employee' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )}

            {/*--------------------------- Trainer Feedback module---------------------------- */}
            {/* {isRole && (
              <ListItem
                disablePadding
                sx={{ display: 'block' }}
                className={location.pathname === '/dashboard/trainer-feedback' ? 'selected' : ''}
              >
                <ListItemButton onClick={() => navigatePage("/dashboard/trainer-feedback")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Tooltip title="Trainer Feedback">
                      <IconButton>
                        <MdFeedback style={{ color: '#2c387e', fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText className='menu-color' primary='Trainer Feedback' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )}
 */}

            {/*--------------------------- scheduled Feedback module---------------------------- */}
            {/* {isRole && (
              <ListItem
                disablePadding
                sx={{ display: 'block' }}
                className={location.pathname === '/dashboard/schedule' ? 'selected' : ''}
              >
                <ListItemButton onClick={() => navigatePage("/dashboard/schedule")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Tooltip title="Scheduled Feedback">
                      <IconButton>
                        <EmailIcon style={{ color: '#2c387e', fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText className='menu-color' primary='Scheduled Feedback' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )} */}

            {/*-------------------------------------Exam Module-----------------------------*/}
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/exam' ? 'selected' : ''}
            >
              <ListItemButton onClick={() => navigatePage("/dashboard/exam")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title="Exam">
                    <IconButton>
                      <RiNewspaperFill style={{ color: '#2c387e', fontSize: '20px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText className='menu-color' primary='Exam' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            {/*----------------------------------Question Module-------------------------------*/}
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/question' ? 'selected' : ''}
            >
              <ListItemButton onClick={() => navigatePage("/dashboard/question")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title="Question">
                    <IconButton>
                      < GiPapers style={{ color: '#2c387e', fontSize: '20px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText className='menu-color' primary='Question' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            {/*---------------------------------Voucher module--------------------------------*/}
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/voucher' ? 'selected' : ''}
            >
              <ListItemButton onClick={() => navigatePage("/dashboard/voucher")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title="Voucher">
                    <IconButton>
                      <MdGeneratingTokens style={{ color: '#2c387e', fontSize: '20px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText className='menu-color' primary='Voucher' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            {/*--------------------------- Feedback module---------------------------- */}
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/feedback' ? 'selected' : ''}
            >
              <ListItemButton onClick={() => navigatePage("/dashboard/feedback")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title="Feedback">
                    <IconButton>
                      <MdFeedback style={{ color: '#2c387e', fontSize: '20px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText className='menu-color' primary='Feedback' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            {/*------------------------------------result module-------------------------------*/}
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/result' ? 'selected' : ''}
            >
              <ListItemButton onClick={() => navigatePage("/dashboard/result")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title="Result">
                    <IconButton>
                      <PiExamFill style={{ color: '#2c387e', fontSize: '20px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText className='menu-color' primary='Result' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

          </List>
          <Divider />

        </Drawer>
        <div className='child-components'>
          <Outlet />
        </div>
      </Box>


      {/*-------------------------------------DialogBox------------------------------------*/}
      <DialogBox
        open={showAlert}
        onClose={() => setShowAlert(false)}
        show={true}
        onConfirm={() => {
          setShowAlert(false);
          sessionStorage.removeItem('role');
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("studentId");
          navigate("/");
        }}
        title={`Confirmation`}
        message={alertMessage}
        submitLabel={`Logout`}
      />
      <DialogBox
        show={true}
        showCancel={false}
        open={ShowScheduledAlert}
        onClose={() => setShowScheduledAlert(false)}
        onConfirm={handleConfirmation} // This function is called when the user confirms the action
        title={`Confirmation`}
        message={alertMessage}
        submitLabel={`OK`}
      />
    </>
  );
}


export default ControlPanel
