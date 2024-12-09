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
import { TextField, Grid, Typography, Card, CardContent, RadioGroup, FormControlLabel, FormControl, FormLabel, Radio } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DialogBox from '../../../component/common/DialogBox';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions'
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import { urls } from '../../../utils/constant';
import { Get, Delete, Put } from '../../../services/Http.Service';
import { userActions } from '../userSliceReducer';
import * as validation from '../../../utils/constant';


const Usertable = () => {
  const [id, setId] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [role, setRole] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [otherbranch, setOtherBranch] = useState("");
  const [branch_id, setBranch_id] = useState();
  const [prnNo, setPrnNo] = useState("");
  const [organization, setOrganization] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState("success");
  const [selectedUserdetail, setSelectedUserDetail] = useState("");
  const [isDetailsPopup, setIsDetailsPopup] = useState(false);
  const dispatch = useDispatch();
  const { allUser } = useSelector((store) => store.user)
  const { SingleUser } = useSelector((store) => store.user);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errors, setErrors] = useState({
    fnameError: false,
    lnameError: false,
    contactError: false,
    emailError: false,
    passwordError: false
  });
  const [open, setOpen] = useState(false);


  useEffect(() => {
    Get(`${urls.user}`)
      .then(response => {
        const reversedUsers = response.data.reverse(); // Reverse the array of users
        dispatch(userActions.getUser(reversedUsers));
        console.log(reversedUsers);
      })
      .catch(error => console.log("user error: ", error));
  }, []);

  useEffect(() => {
    if (SingleUser) {
      const { id, fname, lname, role, contact, gender, email, prnNo, otherbranch, branch, organization } = SingleUser;

      // Set state variables with the data from SingleUser
      setId(id);
      setFname(fname);
      setLname(lname);
      setRole(role);
      setContact(contact);
      setGender(gender);
      setEmail(email);
      setPrnNo(prnNo);
      setOtherBranch(otherbranch);
      setOrganization(organization)

      // Accessing branch data
      if (branch) {
        // Set the branch data to the state variable
        setBranch(branch);

        // Access branch.id
        const branchId = branch.id;
        console.log('Branch ID:', branchId);
        setBranch_id(Number(branchId));

        // Access branch.branchName
        const branchName = branch.branchName;
        console.log('Branch Name:', branchName);
        // You can use branchName as needed

        // Access branch.branchStatus
        const branchStatus = branch.branchStatus;
        console.log('Branch Status:', branchStatus);
        // You can use branchStatus as needed
      }
    }
  }, [SingleUser]);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value); // Set searchQuery state when the search query changes
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleopenDetails = (record) => {
    setIsDetailsPopup(true);
    setSelectedUserDetail(record);
  };

  const handlecloseDetails = () => {
    setIsDetailsPopup(false);
    setSelectedUserDetail("");
  };

  const confirmDelete = () => {
    const id = recordToDeleteId;
    // initUserRequest();
    // deleteUserRequest(id);
    Delete(`${urls.user}${id}`)
      .then(response => {
        if(response.status === 200 ||response.status === 201){
          setSnackbarOpen(true);
          setSnackbarMessage('User deleted successfully');
          setSeverity('success');
          dispatch(userActions.deleteUser(id))
        }
      })
      .catch(error => {
        setSnackbarOpen(true);
        setSnackbarMessage(error.message);
        setSeverity('error');
      });

    closeConfirmDialog();
   
  };

  const deletedata = (id) => {
    openConfirmDialog(id);
  };

  const openConfirmDialog = (id) => {
    setConfirmDialogOpen(true);
    setRecordToDeleteId(id);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setRecordToDeleteId(null);
  };


  const closeSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };
  const updateuser = (event) => {
    event.preventDefault();

    if (errors.fnameError || errors.lnameError || errors.emailError || errors.contactError || errors.passwordError) {
      setSnackbarOpen(true);
      setSnackbarMessage("please fix validation error before submitting");
      setSeverity("error");
      return;
    }

    let uobj = {
      email,
      fname,
      lname,
      branch,
      role,
      gender,
      contact,
      prnNo,
      otherbranch,
      branch_id,
      organization
    };
    console.log(uobj);
    console.log('uobj', uobj);
    uobj['id'] = id;
    // initUserRequest();
    // updateUserRequest(uobj);
    Put(`${urls.user}${id}/`, uobj).then(response => {
      if (response.status === 200 || response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage('User updated successfully');
        setSeverity("success");
        dispatch(userActions.updateUser(response.data))
      }
    })


      .catch(error => {
        setSnackbarOpen(true);
        setSnackbarMessage(error.message);
        setSeverity("error");
      });


    handleClose();
    Get(`${urls.user}`)
      .then(response => {
        const reversedUsers = response.data.reverse(); // Reverse the array of users
        dispatch(userActions.getUser(reversedUsers));
        console.log('inside the user action', reversedUsers);
      })
      .catch(error => console.log("user error: ", error));
  };
  const handleOpen = (id = null) => {
    if (id !== null) {
      dispatch(userActions.GetSingleUser(id));
      setOpen(true);

    } else {
      setOpen(true);

      resetUserFormHandler();
    }
  };


  const resetUserFormHandler = () => {
    setId(null);
    setFname("");
    setLname("");
    setRole("");
    setContact("");
    setGender("");
    setEmail("");
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "fname":
        setFname(value);
        setErrors({ ...errors, fnameError: !validation.isValidName(value) });
        break;
      case "lname":
        setLname(value);
        setErrors({ ...errors, lnameError: !validation.isValidName(value) });
        break;
      case "contact":
        setContact(value);
        setErrors({ ...errors, contactError: !validation.isValidContact(value) });
        break;
      case "email":
        setEmail(value);
        setErrors({ ...errors, emailError: !validation.isValidEmail(value) });
        break;
      case "gender":
        setGender(value);
        break;
      default:
        break;
    }
  };

  const filteredStudents = allUser.filter(data => data?.role === 'student' || data?.role === 'intern')
  const filteredUsers = filteredStudents.filter((data) => {

    const query = searchQuery.toLowerCase(); // Ensure searchQuery is used after initialization
    const fnameIncludes = data.fname && data.fname.toLowerCase().includes(query);
    const lnameIncludes = data.lname && data.lname.toLowerCase().includes(query);
    const emailIncludes = data.email && data.email.toLowerCase().includes(query);
    const contactIncludes = data.contact && data.contact.toLowerCase().includes(query);
    const genderIncludes = data.gender && data.gender.toLowerCase().includes(query);
    return fnameIncludes || lnameIncludes || emailIncludes || genderIncludes || contactIncludes;
  });
  const isSubmitDisabled = !fname || !lname || !email || !contact || !role || !gender || errors.fnameError || errors.lnameError || errors.emailError || errors.contactError;
  const { fnameError, lnameError, contactError, emailError } = errors
  return (
    <div >

      {/* User table  */}
      <Card sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20, borderRadius: '0px' }}>
        <Box sx={{ flexGrow: 1 }} >
          <AppBar component='nav' position="static" sx={{ boxShadow: 'none' }} >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
              >
                Manage Students
              </Typography>
              <TextField
                className='searchinput'
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search Student"
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
            <Table aria-label="simple table">
              <TableHead >
                <TableRow>
                  <TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Sr No</Typography></TableCell>
                  <TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Full Name</Typography></TableCell>
                  <TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Email</Typography></TableCell>
                  {/* <TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Role</Typography></TableCell> */}
                  {/* {<TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Gender</Typography></TableCell>} */}
                  {<TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Contact</Typography></TableCell>}
                  {<TableCell align="left"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Organization</Typography></TableCell>}
                  <TableCell align="center"><Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Action</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colspan={6} align='left'>
                      <strong style={{ fontSize: "34px" }}>No data found</strong>

                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers && filteredUsers.length > 0 && filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                    const currentIndex = page * rowsPerPage + index + 1;

                    return (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: '13px' }} align="left">{currentIndex}</TableCell>
                        <TableCell style={{ fontSize: '13px' }} align="left">{capitalizeFirstLetter(data.fname) + ' ' + capitalizeFirstLetter(data.lname)}</TableCell >
                        <TableCell style={{ fontSize: '13px' }} align="left">{data.email}</TableCell>
                        {/* <TableCell style={{ fontSize: '13px' }} align="left">{capitalizeFirstLetter(data.role)}</TableCell> */}
                        {/* <TableCell style={{fontSize:'13px'}} align="left">{capitalizeFirstLetter(data.gender)}</TableCell> */}
                        <TableCell style={{ fontSize: '13px' }} align="left">{data.contact}</TableCell>
                        <TableCell style={{ fontSize: '13px' }} align="left">{data.organization}</TableCell>
                        <TableCell align="center" >
                          <IconButton aria-label="edit"  >
                            <EditIcon onClick={() => (handleOpen(data.id))} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
                          <IconButton aria-label="visible"  >
                            <VisibilityIcon onClick={() => handleopenDetails(data)} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
                          <IconButton aria-label="delete"  >
                            <DeleteIcon onClick={() => deletedata(data.id)} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}

              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              coldiv={6} // Adjust the coldiv value according to your table structure
              count={filteredUsers.length}
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
              ActionsComponent={TablePaginationActions.default} // Imported component
            />
          </TableContainer>
        </CardContent>

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
        {/* popup update   */}

        <DialogBox
          open={open}
          onClose={handleClose}
          show={true}
          onConfirm={(event) => {
            handleClose()
            updateuser(event)

          }}

          title='Edit Student Details'
          content={
            <form onSubmit={updateuser} style={{ marginTop: '10px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    name="fname"
                    type="text"
                    value={fname}
                    onChange={handleChange}
                    error={fnameError}
                    helperText={(fnameError && validation.errorText("Invalid First Name"))}
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
                    value={lname}
                    onChange={handleChange}
                    error={lnameError}
                    helperText={(lnameError && validation.errorText("Invalid Last Name"))}
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
                    value={email}
                    onChange={handleChange}
                    error={emailError}
                    helperText={(emailError && validation.errorText("Invalid Email"))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Contact"
                    variant="outlined"
                    fullWidth
                    type="tel"
                    name="contact"
                    value={contact}
                    onChange={handleChange}
                    error={contactError}
                    helperText={(contactError && validation.errorText("Invalid contact"))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Role"
                    variant="outlined"
                    fullWidth
                    name="role"
                    value={capitalizeFirstLetter(role)}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" required >Gender</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={gender}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="male" checked={gender === "male"} control={<Radio />} label="Male" />
                      <FormControlLabel value="female" checked={gender === "female"} control={<Radio />} label="Female" />
                      <FormControlLabel value="other" checked={gender === "other"} control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>


              </Grid>
            </form>
          }
          disable={isSubmitDisabled}
          submitLabel={'Update'}
        />

        <DialogBox
          open={isDetailsPopup}
          onClose={handlecloseDetails}
          onConfirm={(event) => {
            handlecloseDetails()
          }}
          show={false}
          title={"Student Details"}
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
                  }} >
                    <div> Full Name: {capitalizeFirstLetter(selectedUserdetail.fname)} {capitalizeFirstLetter(selectedUserdetail.lname)}</div>
                    <div> Gender: {capitalizeFirstLetter(selectedUserdetail.gender)} </div>
                    <div> Role: {capitalizeFirstLetter(selectedUserdetail.role)} </div>
                  </Typography>

                  {/* Conditional rendering based on organization */}
                  {selectedUserdetail.organization === "Hematite branch" ? (
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}>
                      <div style={{ fontWeight: "bold" }}> Branch:</div>
                      {capitalizeFirstLetter(selectedUserdetail.branch ? selectedUserdetail.branch.branchName : 'N/A')} <br />
                    </Typography>
                  ) : selectedUserdetail.organization === "Cdac" ? (
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}>
                      <div style={{ fontWeight: "bold" }}> PRN No:</div>
                      {selectedUserdetail.prnNo ? selectedUserdetail.prnNo : 'N/A'} <br />
                    </Typography>
                  ) : selectedUserdetail.organization === 'Other branch' ? (
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}>
                      <div style={{ fontWeight: "bold" }}> Other Branch:</div>
                      {capitalizeFirstLetter(selectedUserdetail.otherbranch ? selectedUserdetail.otherbranch : 'N/A')} <br />
                    </Typography>
                  ) : null}


                </Box>
              </Grid>

            )
          }
        />
      </Card>
    </div >
  );
};

export default Usertable;
