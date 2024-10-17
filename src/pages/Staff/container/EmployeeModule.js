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
  TextField, Button, Grid, MenuItem, Radio,
  Typography, RadioGroup, FormControlLabel, FormControl, FormLabel, InputLabel,
  CardContent, Card,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogBox from '../../../component/common/DialogBox';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions'
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import { formatDate } from '../../../component/common/DateFormat'
import { urls } from '../../../utils/constant';
import { Put, Get, Delete, Post } from '../../../services/Http.Service';
import { staffActions } from '../staffSliceReducer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as validation from '../../../utils/constant';


const EmployeeModule = () => {
  // local state
  const [id, setId] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [role, setRole] = useState("");
  const [dob, setdob] = useState("");
  const [employeeId, setemployeeId] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
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
    employeeIdError: false
  });
  const [severity, setSeverity] = useState("success");



  // Redux state
  const dispatch = useDispatch();
  const { allEmployee } = useSelector((store) => store.employee)
  const { emp } = useSelector((state) => state.employee);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch all employees
  useEffect(() => {
    Get(`${urls.employee}`)
      .then(response => {
        const reversedEmployee = response.data.reverse();
        dispatch(staffActions.getEmployee(reversedEmployee));
      })
      .catch(error => console.log("staff error: ", error));
  }, []);

  // Update form fields when emp state changes
  useEffect(() => {
    if (emp) {
      const { id, fname, lname, role, dob, employeeId, contact, gender, email } = emp;
      setId(id);
      setFname(fname);
      setLname(lname);
      setRole(role);
      setdob(dob)
      setemployeeId(employeeId)
      setContact(contact);
      setGender(gender);
      setEmail(email);
    }
  }, [emp]);

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
      case "role":
        setRole(value);
        break;
      case "dob":
        setdob(value);
        break;
      case "employeeId":
        setemployeeId(value);
        break;
      case "contact":
        setContact(value);
        break;
      case "gender":
        setGender(value);
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
      case "contact":
        const isContactError = !(validation.isValidContact(value));
        setErrors(prevErrors => ({ ...prevErrors, contactError: isContactError }));
        break;
      case "email":
        const isEmailError = !(validation.isValidEmail(value));
        setErrors(prevErrors => ({ ...prevErrors, emailError: isEmailError }));
        break;
      case "employeeId":
        if (name === 'employeeId') {
          if (!Number.isInteger(Number(value))) {
            setErrors(prevErrors => ({ ...prevErrors, employeeIdError: true, }));
          } else {
            setErrors(prevErrors => ({ ...prevErrors, employeeIdError: false, }))
          }
        }
        break;
      default:
        break;

    }

  };

  // Open dialog for adding/updating employee
  const handleOpen = (id = null) => {
    if (id !== null) {
      // Find the employee with the given id from allEmployee array
      const employee = allEmployee.find(emp => emp.id === id);
      if (employee) {
        const { id, fname, lname, role, dob, employeeId, contact, gender, email } = employee;
        setId(id);
        setFname(fname);
        setLname(lname);
        setRole(role);
        setdob(dob);
        setemployeeId(employeeId);
        setContact(contact);
        setGender(gender);
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
    Delete(`${urls.employee}${id}`)
      .then(response => dispatch(staffActions.deleteEmployee(id)))
      .catch(error => console.log("employee error: ", error));

    closeConfirmDialog();
    setSnackbarOpen(true);
    setSnackbarMessage('Employee deleted successfully');
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
    setRole("");
    setContact("");
    setGender("");
    setEmail("");
    setdob("");
    setemployeeId("");
  };

  // Update or add employee
  const updateEmp = (event) => {
    event.preventDefault();

    // Check for validation errors
    if (errors.fnameError || errors.lnameError || errors.emailError || errors.contactError) {
      setSnackbarOpen(true);
      setSnackbarMessage("please fix validiation error before submiting");
      setSeverity("error");
      return;
    }

    // Check if the employeeId already exists
    const employeeIdExists = allEmployee.some(employee => employee.employeeId == employeeId && employee.id !== id);
    if (employeeIdExists) {
      setSnackbarOpen(true);
      setSnackbarMessage("EmployeeId already exists. Please enter a unique EmployeeId.");
      setSeverity("error");
      return;
    }

    let empObj = {
      email: email,
      fname: fname,
      lname: lname,
      role: role,
      dob: dob,
      employeeId: employeeId,
      gender: gender,
      contact: contact,
    };
    if (isAddaEmp) {
      // addEmployeeRequest(empObj);
      Post(urls.employee, empObj)
        .then(response => {
          dispatch(staffActions.addEmployee(response.data));
          const reverseEmp = [response.data].reverse();
          const updateEmp = [...reverseEmp, ...allEmployee];
          dispatch(staffActions.getEmployee(updateEmp));
        })
        .catch(error => console.log("employee error: ", error));
      setSnackbarOpen(true);
      setSnackbarMessage('employee added successfully.');
      setSeverity("success");

    } else {
      // Update existing employee
      empObj['id'] = id;
      Put(`${urls.employee}${empObj.id}/`, empObj)
        .then(response => dispatch(staffActions.updateEmployee(response.data)))
        .catch(error => console.log("employee error: ", error));
      setSnackbarOpen(true);
      setSnackbarMessage('employee updated successfully.');
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

  // Filter employees based on search query
  const filterEmp = allEmployee && allEmployee.filter((data) => {
    const query = searchQuery.toLowerCase();
    const fnameIncludes = data.fname && data.fname.toLowerCase().includes(query);
    const lnameIncludes = data.lname && data.lname.toLowerCase().includes(query);
    const emailIncludes = data.email && data.email.toLowerCase().includes(query);
    const roleIncludes = data.role && data.role.toLowerCase().includes(query);
    const contactIncludes = data.contact && data.contact.toLowerCase().includes(query);
    const employeeIdIncludes = data.employeeId && data?.employeeId?.toString().includes(query);
    const dateIncludes = data.dob && data.dob.includes(query);
    const genderIncludes = data.gender && data.gender.toLowerCase().includes(query);

    return fnameIncludes || lnameIncludes || emailIncludes || roleIncludes || dateIncludes || genderIncludes || contactIncludes || employeeIdIncludes;
  });
  // Determine if submit button should be disabled
  const isSubmitDisabled = !fname || !lname || !email || !dob || !contact || !role || !gender || errors.fnameError || errors.lnameError || errors.emailError || errors.contactError || errors.passwordError;

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
                Manage Employee
              </Typography>
              <TextField
                className='searchinput'
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search Employee"
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button variant="contained" color="primary" size="small" type="button" sx={{ marginBottom: 2 }} startIcon={<AddIcon />} onClick={() => (handleOpen())}>Add</Button>
          </div>
          <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} >
            <Table aria-label="simple table" sx={{}}>
              <TableHead style={{ overflow: 'auto' }}>
                <TableRow>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Sr No</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Full Name</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Email</Typography></TableCell>
                  <TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Employee Id</Typography></TableCell>
                  <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Action</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterEmp.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align='left'>
                      <strong style={{ fontSize: "34px" }}>No data found</strong>
                    </TableCell>
                  </TableRow>
                ) : (
                  filterEmp && filterEmp.length > 0 && filterEmp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                    const currentIndex = page * rowsPerPage + index + 1;
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: '13px' }} component="th" align="left" scope="row">{currentIndex}</TableCell>
                        <TableCell style={{ fontSize: '13px' }} className="tablebody" align="left">{capitalizeFirstLetter(data.fname) + ' ' + capitalizeFirstLetter(data.lname)}</TableCell >
                        <TableCell style={{ fontSize: '13px' }} className="tablebody" align="left">{data.email}</TableCell>
                        <TableCell style={{ fontSize: '13px' }} className="tablebody" align="left">{data.employeeId}</TableCell>
                        
                        <TableCell className="tablebody" align="center" >
                          <IconButton aria-label="logout"  >
                            <EditIcon onClick={() => (handleOpen(data.id))} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
                          <IconButton aria-label="visible"  >
                            <VisibilityIcon onClick={() => handleopenDetails(data)} style={{ color: '#2c387e', fontSize: '18px' }} />
                          </IconButton>
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
              count={filterEmp.length}
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
            updateEmp(event)
          }}

          title={isAddaEmp ? 'Add Employee' : 'Update Employee'}
          content={
            <form onSubmit={updateEmp}>
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.emailError}
                    helperText={errors.emailError && validation.errorText("Please enter a valid Email") || 'eg: John1@gmail.com'}
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
                    size='small'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.contactError}
                    helperText={errors.contactError && validation.errorText("Please enter a valid contact") || 'eg: 8888888888'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    margin="normal"
                    required
                    fullWidth
                    label="Role"
                    name="role"
                    size='small'
                    id="role"
                    value={role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="trainer">Trainer</MenuItem>
                    <MenuItem value="counsellor">Counsellor</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ ml: 1 }}>DOB</InputLabel>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    name="dob"
                    type='date'
                    size='small'
                    value={dob}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="employeeId"
                    variant="outlined"
                    fullWidth
                    name="employeeId"
                    value={employeeId}
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
                    <div> Full Name: {capitalizeFirstLetter(selectedUserdetail.fname)} {capitalizeFirstLetter(selectedUserdetail.lname)}</div>
                    </Typography>
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}><div> Gender: {capitalizeFirstLetter(selectedUserdetail.gender)} </div>
                    </Typography>
                    
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}><div> Role: {capitalizeFirstLetter(selectedUserdetail.role)} </div>
                    </Typography>
                    
                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}><div> Contact: {capitalizeFirstLetter(selectedUserdetail.contact)} </div>
                    </Typography>

                    <Typography component="div" variant="subtitle1" sx={{
                      fontSize: isSmallScreen ? '14px' : '18px', p: 2,
                      borderRadius: 3,
                      bgcolor: 'background.default',
                      display: 'grid',
                      gap: 0,
                      maxWidth: '800px',
                      boxShadow: 4,
                    }}>
                  
                    <div> Dob:{formatDate(selectedUserdetail.dob)}</div>
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

export default EmployeeModule;
