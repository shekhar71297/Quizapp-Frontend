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
	Select,
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
import DialogBox from '../../../component/common/DialogBox';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions'
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import { formatDate } from '../../../component/common/DateFormat'
import { urls } from '../../../utils/constant';
import { Put, Get, Delete, Post } from '../../../services/Http.Service';
import { staffActions } from '../../Staff/staffSliceReducer';
import * as validation from '../../../utils/constant';
import { batchActions } from '../batchSliceReducer';
import { useNavigate } from 'react-router-dom';


const AddBatch = () => {
	// local state
	const [id, setId] = useState(null);
	const [trainerId, setTrainerId] = useState("");
	const [courseId, setCourseId] = useState("");
	const [startDate, setStartDate] = useState("");
	// const [duration_in_days, setDuration] = useState("");
	const [duration, setDuration] = useState("");
	const [durationUnit, setDurationUnit] = useState("days");
	const [batchname, setBatchName] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddaEmp, setisAddaEmp] = useState(true);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [recordToDeleteId, setRecordToDeleteId] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [isValidDuration, SetValidDuration] = useState(true)
	const [errors, setErrors] = useState({
		fnameError: false,
		lnameError: false,
		contactError: false,
		emailError: false,
		employeeIdError: false,
		batchNameError:false
	});
	const [severity, setSeverity] = useState("success");
	const nav = useNavigate()


	// Redux state
	const dispatch = useDispatch();
	const { allEmployee } = useSelector((store) => store.employee)
	const { SingleBatch } = useSelector((state) => state.batch);
	const { allBatches } = useSelector((state) => state.batch);
	const [showSubmitButton, setShowSubmitButton] = useState(true);
	const { allCourse } = useSelector((store) => store.batch);

	useEffect(() => {
		Get(urls.course)
			.then((response) => dispatch(batchActions.Get_Course(response.data)))
			.catch((error) => console.log("Batch error: ", error));
	}, []);

	useEffect(() => {
		Get(urls.batch)
			.then((response) => dispatch(batchActions.GET_BATCH(response.data.reverse())))
			.catch((error) => console.log("Batch error: ", error));
	}, [snackbarOpen]);
	console.log(SingleBatch);

	useEffect(() => {
		Get(urls.batch)
			.then((response) => dispatch(batchActions.GET_BATCH(response.data.reverse())))
			.catch((error) => console.log("Batch error: ", error));
	}, []);

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
		if (SingleBatch) {
			const { id, courseId, trainerId, duration_in_days, startDate, batchname } = SingleBatch;
			setId(id);
			setCourseId(courseId);
			setTrainerId(trainerId);
			setDuration(duration_in_days?.replace(/[a-z]/g, '')); // Extracting only the numeric part
			setDurationUnit(duration_in_days?.replace(/\d+/g, '')); // Extracting only the unit part (days or years)
			setStartDate(startDate);
			setBatchName(batchname);
		}
	}, [SingleBatch]);

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
	const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === 'batchname') { 
      const isBatchNameError = !validation.isValidBatchName(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        batchNameError: isBatchNameError,

      }));
    }
	}
	// Handle input change
	const handleChange = (event) => {
		const { name, value } = event.target;

		switch (name) {
			case "courseId":
				setCourseId(value);
				break;
			case "trainerId":
				setTrainerId(value);
				break;
			case "duration":
				setDuration(value);
				break;
			case "durationUnit":
				setDurationUnit(value);
				break;
			case "startDate":
				setStartDate(value);
				break;
			case "batchname":
				setBatchName(value);
				break;
			default:
				break;
		}

		if (name === 'duration') {
			if (!Number.isInteger(Number(value))) {
				setSnackbarMessage('Only numeric value accepted .');
				setSeverity('error')
				setSnackbarOpen(true);
				SetValidDuration(false)
			}
		}
	};

	//   const handleBlur = (event) => {
	//     const { name, value } = event.target;
	//     // Validate input based on input name
	//     switch (name) {
	//       case "fname":
	//         const isFnameError = !(validation.isValidName(value));
	//         setErrors(prevErrors => ({ ...prevErrors, fnameError: isFnameError }));
	//         break;
	//       case "lname":
	//         const isLnameError = !(validation.isValidName(value));
	//         setErrors(prevErrors => ({ ...prevErrors, lnameError: isLnameError }));
	//         break;
	//       case "contact":
	//         const isContactError = !(validation.isValidContact(value));
	//         setErrors(prevErrors => ({ ...prevErrors, contactError: isContactError }));
	//         break;
	//       case "email":
	//         const isEmailError = !(validation.isValidEmail(value));
	//         setErrors(prevErrors => ({ ...prevErrors, emailError: isEmailError }));
	//         break;
	//       case "employeeId":
	//         if (name === 'employeeId') {
	//           if (!Number.isInteger(Number(value))) {
	//             setErrors(prevErrors => ({ ...prevErrors, employeeIdError: true, }));
	//           } else {
	//             setErrors(prevErrors => ({ ...prevErrors, employeeIdError: false, }))
	//           }
	//         }
	//         break;
	//       default:
	//         break;

	//     }

	//   };

	// Open dialog for adding/updating employee
	const handleOpen = (id = null) => {
		if (id !== null) {
			const batch = allBatches.find(val => val.id === id);
			console.log(batch);
			if (batch) {
				const { id, duration_in_days, startDate, batchname } = batch;
				setId(id);
				setCourseId(batch.course.id);
				setTrainerId(batch.trainer.id);
				setDuration(duration_in_days.replace(/[a-z]/g, ''));
				setDurationUnit(duration_in_days.replace(/\d+/g, ''));
				setStartDate(startDate);
				setBatchName(batchname);
				setOpen(true);
				setShowSubmitButton(false);
				setisAddaEmp(false)
			}
		} else {
			setOpen(true);
			setShowSubmitButton(true);
			resetBatchFormHandler();
			setisAddaEmp(true)
		}
	};

	const resetBatchFormHandler = () => {
		setId(null);
		setBatchName("");
		setCourseId("");
		setDuration("");
		setTrainerId("");
		setStartDate("");
		setDurationUnit("days");
	};


	// Close dialog
	const handleClose = () => {
		setOpen(false);
	};

	// Confirm employee deletion
	const confirmDelete = () => {

		const id = recordToDeleteId;
		Delete(`${urls.batch}${id}`)
			.then(response => dispatch(batchActions.DELETE_BATCH(id)))
			.catch(error => console.log("batch error: ", error));

		closeConfirmDialog();
		setSnackbarOpen(true);
		setSnackbarMessage('batch deleted successfully');
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



	// Update or add employee
	const updateEmp = (event) => {
		event.preventDefault();


		// Check if the employeeId already exists
		const batchNameExists = allBatches.some(batch => batch.batchname == batchname && batch.id !== id);
		if (batchNameExists) {
			setSnackbarOpen(true);
			setSnackbarMessage("Batch name already exists. Please enter a unique batch name.");
			setSeverity("error");
			return;
		}

		if (!isValidDuration) {
			return
		}
		const duration_in_days = `${duration}${durationUnit}`;
		let batchObj = {
			course_id: courseId,
			trainer_id: trainerId,
			duration_in_days: duration_in_days,
			startDate: startDate,
			batchname: batchname.toLowerCase(),
		};
		if (isAddaEmp) {
			// addEmployeeRequest(empObj);
			Post(urls.batch, batchObj)
				.then(response => {
					dispatch(batchActions.ADD_BATCH(response.data));
					const reverseEmp = [response.data].reverse();
					const updateBatches = [...reverseEmp, ...allBatches];
					dispatch(batchActions.GET_BATCH(updateBatches));
				})
				.catch(error => console.log("batch error: ", error));
			setSnackbarOpen(true);
			setSnackbarMessage('Batch Added!.');
			setSeverity("success");

		} else {
			// Update existing employee
			batchObj['id'] = id;
			Put(`${urls.batch}${batchObj.id}/`, batchObj)
				.then(response => dispatch(batchActions.UPDATE_BATCH(response.data)))
				.catch(error => console.log("batch error: ", error));
			setSnackbarOpen(true);
			setSnackbarMessage('Batch Updated!.');
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
	const filterBatch = allBatches && allBatches.filter((data) => {
		const query = searchQuery.toLowerCase();
		const batchNameIncludes = data.batchname && data.batchname.toLowerCase().includes(query);
		const courseNameIncludes = data?.course?.CourseName && data?.course?.CourseName.toLowerCase().includes(query);

		return batchNameIncludes || courseNameIncludes;
	});

	const goBacktoCourse = () => {
		nav('/dashboard/batch')
	}
	// Determine if submit button should be disabled
	const isSubmitDisabled = !courseId || !trainerId || !batchname || !startDate || !duration || !durationUnit || errors.batchNameError;

	return (
		<>
			<Card sx={{ marginRight: "25px", marginTop: 7, marginLeft: '-17px', position: "relative", borderRadius: '0px' }}>
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
								Manage Batch
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
									<TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Sr No</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Batch Name</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Course Name</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Start Date</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Duration</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Trainer Name</Typography></TableCell>
									<TableCell align="left"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Action</Typography></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filterBatch.length === 0 ? (
									<TableRow>
										<TableCell colSpan={9} align='left'>
											<strong style={{ fontSize: "34px" }}>No data found</strong>
										</TableCell>
									</TableRow>
								) : (
									filterBatch && filterBatch.length > 0 && filterBatch.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
										const currentIndex = page * rowsPerPage + index + 1;
										return (
											<TableRow key={index}>
												<TableCell component="th" align="center" scope="row">{currentIndex}</TableCell>
												<TableCell className="tablebody" align="left">{capitalizeFirstLetter(data.batchname)}</TableCell >
												<TableCell className="tablebody" align="left">{data?.course?.CourseName}</TableCell>
												<TableCell className="tablebody" align="left">{formatDate(data.startDate)}</TableCell>
												<TableCell className="tablebody" align="center">{data.duration_in_days}</TableCell>
												<TableCell className="tablebody" align="left">{capitalizeFirstLetter(data?.trainer?.fname) + ' ' + capitalizeFirstLetter(data?.trainer?.lname)} </TableCell>
												<TableCell className="tablebody" align="left" >
													<IconButton aria-label="logout"  >
														<EditIcon onClick={() => (handleOpen(data.id))} style={{ color: '#2c387e', fontSize: '25px' }} />
													</IconButton>
													<IconButton aria-label="logout"  >
														<DeleteIcon onClick={() => deletedata(data.id)} style={{ color: '#2c387e', fontSize: '25px' }} />
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
							count={filterBatch.length}
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
					show={true}
					onConfirm={(event) => {
						handleClose()
						updateEmp(event)
					}}

					title={isAddaEmp ? 'Add Batch' : 'Update Batch'}
					content={
						<form onSubmit={updateEmp}>
							<Grid container spacing={2} sx={{ marginTop: 3 }}>
								<Grid item xs={12} >
									<TextField
										required
										label="Batch name"
										variant="outlined"
										fullWidth
										name="batchname"
										size='small'
										type="text"
										inputProps={{maxLength:30}}
										onBlur={handleBlur}
										value={batchname}
										onChange={handleChange}
										error={errors.batchNameError}
                    helperText={(errors.batchNameError && validation.errorText("Invalid Batch Name."))}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<FormControl fullWidth size='small' >
										<InputLabel id="demo-simple-select1-label">Select course</InputLabel>
										<Select
											labelId="demo-simple-select1-label"
											id="demo-simple-select1"
											value={courseId}
											name='courseId'
											label="Select course"
											onChange={handleChange}
										>       <MenuItem aria-readonly >Select Course</MenuItem>
											{allCourse && allCourse?.length > 0 && allCourse?.map((val, index) => (
												<MenuItem key={index} value={val.id}>{capitalizeFirstLetter(val.CourseName)}</MenuItem>
											))}

										</Select>
									</FormControl>

								</Grid>
								<Grid item xs={12} md={6} >
									<FormControl fullWidth size='small'>
										<InputLabel id="demo-simple-select-label">Select trainer</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={trainerId}
											name='trainerId'
											label="Select trainer"
											onChange={handleChange}
										>
											<MenuItem aria-readonly >Select Trainer</MenuItem>
											{allEmployee && allEmployee?.length > 0 && allEmployee?.map((val, index) => (
												<MenuItem key={index} value={val.id}>{capitalizeFirstLetter(val.fname) + ' ' + capitalizeFirstLetter(val.lname)}</MenuItem>
											))}

										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12}>
									<TextField
										required
										// label="Start Date"
										variant="outlined"
										fullWidth
										type="date"
										name="startDate"
										value={startDate}
										size='small'
										onChange={handleChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													Start Date:
												</InputAdornment>
											),
										}}

									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										label="Duration"
										value={duration}
										onChange={handleChange}
										name="duration"
										fullWidth
										required
										size='small'
										inputProps={{maxLength:3}}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										label="Duration Unit"
										value="days"
										onChange={handleChange}
										name="durationUnit"
										fullWidth
										required
										aria-readonly
										size='small'
									/>
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
			<Button variant="outlined" sx={{ marginTop: 4 }} size="small" onClick={goBacktoCourse}>Back to Courses</Button>
		</>
	);
};

export default AddBatch;
