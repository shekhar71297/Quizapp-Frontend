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
import {
  TextField, Grid, MenuItem,
  Typography, InputLabel,
  CardContent, Card,
	Tooltip,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogBox from '../../../component/common/DialogBox';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions'
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import { urls } from '../../../utils/constant';
import { Put, Get, Delete, Post } from '../../../services/Http.Service';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as validation from '../../../utils/constant';
import { enquiryActions } from '../EnquirySliceReducer';
import { formatDate } from '../../../component/common/DateFormat';


const EnquiryModule = () => {
  // local state
  const [id, setId] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [status, setStaus] = useState("");
  const [message, setMessage] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddaEmp, setisAddaEmp] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isDetailsPopup, setIsDetailsPopup] = useState(false);
  const [selectedUserdetail, setSelectedUserDetail] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({
    fnameError: false,
    lnameError: false,
    contactError: false,
    emailError: false,
  });
  const [severity, setSeverity] = useState("success");



  // Redux state
  const dispatch = useDispatch();
  const { allEnquiry } = useSelector((store) => store.enquiry)
  const { singleEnquiry } = useSelector((state) => state.enquiry);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch all employees
  useEffect(() => {
    Get(`${urls.enquiry}`)
      .then(response => {
        const reversedEmployee = response.data.reverse();
        dispatch(enquiryActions.getEnquiry(reversedEmployee));
      })
      .catch(error => console.log("enquiry error: ", error));
  }, []);

  // Update form fields when emp state changes
  useEffect(() => {
    if (singleEnquiry) {
      const { id, fname, lname, email,message,status,mobile } = singleEnquiry;
      setId(id);
      setFname(fname);
      setLname(lname);
      setStaus(status);
      setMobile(mobile)
      setMessage(message)
      setEmail(email);
    }
  }, [singleEnquiry]);

  // Handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state based on input name
    switch (name) {
      case "fname":
        setFname(value);
        break;
      case "lname":
        setLname(value);
        break;
      case "status":
        setStaus(value);
        break;
      case "message":
        setMessage(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  }
  const handleBlur = (event) => {
    const { name, value } = event.target;
    // Validate input based on input name
    switch (name) {
      case "fname":
        const isFnameError = !(validation.isValidName(value));
        setErrors(prevErrors => ({ ...prevErrors, fnameError: isFnameError }));
        break;
      case "lname":
        const isLnameError = !(validation.isValidName(value));
        setErrors(prevErrors => ({ ...prevErrors, lnameError: isLnameError }));
        break;
      case "mobile":
        const isContactError = !(validation.isValidContact(value));
        setErrors(prevErrors => ({ ...prevErrors, contactError: isContactError }));
        break;
      case "email":
        const isEmailError = !(validation.isValidEmail(value));
        setErrors(prevErrors => ({ ...prevErrors, emailError: isEmailError }));
        break;
      default:
        break;

    }

  };

  // Open dialog for adding/updating employee
  const handleOpen = (id = null) => {
    if (id !== null) {
      // Find the employee with the given id from allEmployee array
      const enquiry = allEnquiry.find(val => val.id === id);
      if (enquiry) {
        const { id, fname, lname, mobile, message, status, email } = enquiry;
        setId(id);
        setFname(fname);
        setLname(lname);
        setMobile(mobile);
        setMessage(message);
        setStaus(status);
        setEmail(email);
        setOpen(true);
        setisAddaEmp(false);
      }
    } else {
      setOpen(true);
      setisAddaEmp(true);
      resetEmployeeFormHandler();
    }
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };
  const handleopenDetails = (record) => {
    setIsDetailsPopup(true);
    setSelectedUserDetail(record);
  };

  const handlecloseDetails = () => {
    setIsDetailsPopup(false);
    setSelectedUserDetail("");
  };

  // Confirm employee deletion
  const confirmDelete = () => {

    const id = recordToDeleteId;
    Delete(`${urls.enquiry}${id}`)
      .then(response => dispatch(enquiryActions.deleteEnquiry(id)))
      .catch(error => console.log("enquiry error: ", error));

    closeConfirmDialog();
    setSnackbarOpen(true);
    setSnackbarMessage('Enquiry deleted successfully');
    setSeverity('error');
  };
  // Delete data handler
  const deletedata = (id) => {
    openConfirmDialog(id);
  };

  // Open delete confirmation dialog
  const openConfirmDialog = (id) => {
    setConfirmDialogOpen(true);
    setRecordToDeleteId(id);
  };
  // Close delete confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setRecordToDeleteId(null);
  };

  // Reset employee form fields
  const resetEmployeeFormHandler = () => {
    setId(null);
    setFname("");
    setLname("");
    setMessage("");
    setMobile("");
    setStaus("");
    setEmail("");
  };

  // Update or add employee
  const updateStudent = (event) => {
    event.preventDefault();

    // Check for validation errors
    if (errors.fnameError || errors.lnameError || errors.emailError || errors.contactError) {
      setSnackbarOpen(true);
      setSnackbarMessage("please fix validiation error before submiting");
      setSeverity("error");
      return;
    }


    let enqObj = {
      email: email,
      fname: fname,
      lname: lname,
      message: message,
      mobile: mobile,
      status: status
    };
    if (isAddaEmp) {
      // addEmployeeRequest(empObj);
      Post(urls.enquiry, enqObj)
        .then(response => {
          const reverseEmp = [response.data].reverse();
          dispatch(enquiryActions.addEnquiry(reverseEmp));
        })
        .catch(error => console.log("employee error: ", error));
      setSnackbarOpen(true);
      setSnackbarMessage('enquiry added successfully.');
      setSeverity("success");

    } else {
      // Update existing employee
      enqObj['id'] = id;
      Put(`${urls.enquiry}${enqObj.id}/`, enqObj)
        .then(response => dispatch(enquiryActions.updateEnquiry(response.data)))
        .catch(error => console.log("enquiry error: ", error));
      setSnackbarOpen(true);
      setSnackbarMessage('enquiry updated successfully.');
      setSeverity("success");
    }

    handleClose();
    setOpen(false);
  };
  // Close snackbar
  const closeSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  // Filter enquiry based on search query
  const filterEnquiry = allEnquiry && allEnquiry.filter((data) => {
    const query = searchQuery.toLowerCase();
    const fnameIncludes = data.fname && data.fname.toLowerCase().includes(query);
    const lnameIncludes = data.lname && data.lname.toLowerCase().includes(query);
    const emailIncludes = data.email && data.email.toLowerCase().includes(query);
    const statusIncludes = data.status && data.status.toLowerCase().includes(query);
    const dateIncludes = data.enquiryDate && data.enquiryDate.includes(query);
    const mobileIncludes = data.mobile && data.mobile.includes(query);

    return fnameIncludes || lnameIncludes || emailIncludes || statusIncludes || dateIncludes || mobileIncludes;
  });
	console.log(allEnquiry);
	

  return (
    <>

      <Card sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20, borderRadius: '0px' }}>
        <Box sx={{ display: 'flex' }}>
          {/* <CssBaseline /> */}
          <AppBar component='nav' position="static" sx={{ boxShadow: 'none' }} >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
              >
                Manage Enquiry
              </Typography>
              <TextField
                className='searchinput'
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search student"
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
          <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} >
            <Table aria-label="simple table" sx={{}}>
              <TableHead style={{ overflow: 'auto' }}>
                <TableRow>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Sr No</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Date</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Full Name</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Mobile no</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>status</Typography></TableCell>
                  <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Action</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterEnquiry.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align='left'>
                      <strong style={{ fontSize: "34px" }}>No data found</strong>
                    </TableCell>
                  </TableRow>
                ) : (
                  filterEnquiry && filterEnquiry.length > 0 && filterEnquiry.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                    const currentIndex = page * rowsPerPage + index + 1;
                    return (
                      <TableRow key={index}>
                        <TableCell  component="th" align="left" scope="row">{currentIndex}</TableCell>
												<TableCell  className="tablebody" align="left">{formatDate(data.enquiryDate)}</TableCell>
                        <TableCell  className="tablebody" align="left">{capitalizeFirstLetter(data.fname) + ' ' + capitalizeFirstLetter(data.lname)}</TableCell >
                        <TableCell  className="tablebody" align="left">{data.mobile}</TableCell>
                        <TableCell  className="tablebody" align="left">{capitalizeFirstLetter(data.status)}</TableCell>
                        
                        <TableCell className="tablebody" align="center" >
                          <IconButton aria-label="logout"  >
                            <EditIcon onClick={() => (handleOpen(data.id))} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
													<Tooltip title="See Message">
                          <IconButton aria-label="visible"  >
                            <VisibilityIcon onClick={() => handleopenDetails(data)} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
													</Tooltip>
                          <IconButton aria-label="logout"  >
                            <DeleteIcon onClick={() => deletedata(data.id)} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
                          {/* <Button onClick={() => handleopenDetails(data)}><VisibilityIcon /></Button> */}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={9}
              count={filterEnquiry.length}
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
        </CardContent>
        {/* popup update and add  */}
        <DialogBox
          open={open}
          onClose={handleClose}
          show={showSubmitButton}
          onConfirm={(event) => {
            handleClose()
            updateStudent(event)
          }}

          title={'Edit enquiry details'}
          content={
            <form onSubmit={updateStudent}>
              <Grid container spacing={2} sx={{ marginTop: 3 }}>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    name="fname"
                    size='small'
                    type="text"
                    value={fname}
										InputProps={{
											readOnly: true, // This makes the field read-only.
										}}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.fnameError}
                    helperText={errors.fnameError && validation.errorText("Please enter a valid first name") || 'eg:John'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="lname"
                    size='small'
                    value={lname}
										InputProps={{
											readOnly: true, // This makes the field read-only.
										}}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.lnameError}
                    helperText={errors.lnameError && validation.errorText("Please enter a valid last name") || 'eg: Dev'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type='email'
                    name="email"
                    size='small'
                    value={email}
										InputProps={{
											readOnly: true, // This makes the field read-only.
										}}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.emailError}
                    helperText={errors.emailError && validation.errorText("Please enter a valid Email") || 'eg: John1@gmail.com'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    label="Mobile No"
                    variant="outlined"
                    fullWidth
                    type="tel"
                    name="mobile"
                    value={mobile}
										aria-readonly InputProps={{
											readOnly: true, // This makes the field read-only.
										}}
                    size='small'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.contactError}
                    helperText={errors.contactError && validation.errorText("Please enter a valid contact") || 'eg: 8888888888'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ ml: 1 }}>Message</InputLabel>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    name="message"
                    type='text'
                    size='small'
                    value={message}
										InputProps={{
											readOnly: true, // This makes the field read-only.
										}}
                    onChange={handleChange}
                  />
                </Grid>
								<Grid item xs={12}>
                  <TextField
                    select
                    margin="normal"
                    required
                    fullWidth
                    label="Status"
                    name="status"
                    size='small'
                    id="status"
                    value={status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="no answer">No Answer</MenuItem>
										<MenuItem value="busy">Busy</MenuItem>
                    <MenuItem value="wrong number">Wrong Number</MenuItem>
                    <MenuItem value="Follow-Up Needed">Follow-Up Needed</MenuItem>
										<MenuItem value="Customer Unreachable">Customer Unreachable</MenuItem>
                    <MenuItem value="wrong number">Wrong Number</MenuItem>
                    <MenuItem value="disconnected">Disconnected</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </form>
          }
          // disable={isSubmitDisabled}
          submitLabel={'Submit'}
        />


        {/* Delete pop up model  */}
        <DialogBox
          open={confirmDialogOpen}
          onClose={closeConfirmDialog}
          show={true}
          onConfirm={() => {
            closeConfirmDialog();
            confirmDelete();
          }}
          message={`Are you sure you want to delete this record?`}
          title={`Delete Record`}
          submitLabel={`Delete`}
        // show={showSubmitButton}
        />


        <DialogBox
          open={isDetailsPopup}
          onClose={handlecloseDetails}
          onConfirm={(event) => {
            handlecloseDetails()
          }}
          show={false}
          title={"User Details"}
          content={
            selectedUserdetail && (
              <Grid container spacing={2}>
                <Box style={{ width: "1200px" }} sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: 'background.default',
                  display: 'grid',
                  gap: 2,
                }}>
                  <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      marginTop: 1
                    }}>
                    <div> <strong>Full Name:</strong> {capitalizeFirstLetter(selectedUserdetail.fname)} {capitalizeFirstLetter(selectedUserdetail.lname)}</div>
										<div><strong>Email:</strong> {selectedUserdetail.email} </div>
                    </Typography>  
                
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}><div> <strong>Message:</strong> {capitalizeFirstLetter(selectedUserdetail.message)} </div>
                    </Typography>
                </Box>
              </Grid>

            )
          }
        />

        {/* alert message after action perform */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={closeSnackbar}
            severity={severity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

      </Card>
    </>
  );
};

export default EnquiryModule;
