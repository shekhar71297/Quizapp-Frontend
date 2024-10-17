import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Grid, Typography } from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DialogBox from '../../../component/common/DialogBox';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions';
import { formatDate } from '../../../component/common/DateFormat'
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { TrainRounded } from '@mui/icons-material';
import { enrollActions } from '../enrollSlice';

function EnrollmentModule() {
  const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedEnrollment, setSelectedEnrollment] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useDispatch();
	const { allEnrollDetails } = useSelector((store) => store.enroll,
	);

	useEffect(() => {
		Get(urls.enroll).then(response => {
			const reverseEnroll = response.data.reverse();
			dispatch(enrollActions.getEnrollmentDetails(reverseEnroll))
		}).catch((error) => {
			console.error('Error fetching feedback:', error);
		})
	}, []);

	// Filter feedback based on search query
	const searchEnrollDetail = allEnrollDetails && allEnrollDetails.length > 0 && allEnrollDetails.filter(val => {
		const fname = val && val.fname && val.fname.toLowerCase().includes(searchQuery);
    const lname = val && val.lname && val.lname.toLowerCase().includes(searchQuery);
		const email = val && val.email && val.email.toLowerCase().includes(searchQuery);
    const course = val && val.course && val.course.toLowerCase().includes(searchQuery);
    const mode = val && val.mode && val.mode.toLowerCase().includes(searchQuery);
		return fname || email || course || mode ;
	}) || [];

	// Function to handle page change in pagination
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	// Function to handle rows per page change in pagination
	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Function to handle search query change
	const handleSearchChange = event => {
		setSearchQuery(event.target.value);
		setPage(0);
	};

	// Function to handle eye icon click
	const handleEyeIconClick = feedback => {
		setSelectedEnrollment(feedback);
		setOpenDialog(true);
	};

	// Function to handle dialog box close
	const handleCloseDialog = () => {
		setOpenDialog(false);
	};
  return (
    <div>
      	<Card sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20, borderRadius: '0px' }}>
				<Box sx={{ flexGrow: 1 }}>
					<AppBar component='nav' position="static" sx={{ boxShadow: 'none' }} >
						<Toolbar>
							<Typography
								variant="h6"
								noWrap
								component="div"
								sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
							>
								Manage Register Student
							</Typography>
							<TextField
								className='searchinput'
								type="text"
								value={searchQuery}
								onChange={handleSearchChange}
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
					<TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="left" sx={{ fontWeight: "bold" }}>Sr No</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Date</TableCell>
									<TableCell align="left" sx={{ fontWeight: "bold" }}>Student Name</TableCell>
									<TableCell align="left" sx={{ fontWeight: "bold" }}>Student Email</TableCell>
									<TableCell align="left" sx={{ fontWeight: "bold" }}>Student Contact</TableCell>
									<TableCell align="left" sx={{ fontWeight: "bold" }}>Course</TableCell>
									<TableCell align="center" sx={{ fontWeight: "bold" }}>Trainning Mode</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{searchEnrollDetail.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} align="left">
											<strong style={{ fontSize: "28px" }}>No data found</strong>
										</TableCell>
									</TableRow>
								) : (
									searchEnrollDetail && searchEnrollDetail.length > 0 && searchEnrollDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
										const currentIndex = page * rowsPerPage + index;


										return (
											<TableRow key={index}>
												<TableCell align="left" component="th" scope="row">{currentIndex + 1}</TableCell>
                        <TableCell align="left">{formatDate(data.enrollDate)}</TableCell>
												<TableCell align="left">{capitalizeFirstLetter(data.fname)} {capitalizeFirstLetter(data.lname)}</TableCell>
												<TableCell align="left">{capitalizeFirstLetter(data.email)}</TableCell>
												<TableCell align="left">{capitalizeFirstLetter(data.mobile)}</TableCell>
												<TableCell align="left">{capitalizeFirstLetter(data.course)}</TableCell>
                        <TableCell align="center">{capitalizeFirstLetter(data.mode)}</TableCell>
												{/* <TableCell align="center">
													<IconButton aria-label="logout"  >
														<RemoveRedEyeRoundedIcon onClick={() => handleEyeIconClick(data)} style={{ color: '#2c387e', fontSize: '25px' }} />
													</IconButton>

												</TableCell> */}
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							colSpan={8}
							count={searchEnrollDetail.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: { 'aria-label': 'rows per page' },
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions.default}
						/>
					</TableContainer>
				</CardContent>
				{/* <DialogBox
					open={openDialog}
					onClose={handleCloseDialog}
					// message={'Student feedback detail'}
					title={"Student Feedback"}
					show={false}
					content={
						selectedEnrollment && (
							<Grid container spacing={2}>
								<Box style={{ width: "1200px" }} sx={{
									p: 2,
									bgcolor: 'background.default',
									display: 'grid',
									gap: 2,
								}}
								>
									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '800px',
											boxShadow: 4,
										}} >
										<div> Student Name : {capitalizeFirstLetter(selectedEnrollment.name)}</div></Typography>
								
									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '600px', // Set maximum width for better layout
											boxShadow: 4, // Add shadow for depth
										}} >

										<div style={{ fontWeight: 'bold' }}> DateTime</div>
										{formatDate(selectedEnrollment.datetime)} <br />
									</Typography>

									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '600px', // Set maximum width for better layout
											boxShadow: 4, // Add shadow for depth
										}} >

										<div style={{ fontWeight: 'bold' }}> How satisfied are you with our services? (1-5)</div>
										{selectedEnrollment.question1} <br />
									</Typography>

									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '600px', // Set maximum width for better layout
											boxShadow: 4, // Add shadow for depth
										}} >

										<div style={{ fontWeight: 'bold' }}>How likely are you to recommend us to others? (1-5)</div>
										{selectedEnrollment.question2} <br />
									</Typography>

									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '600px', // Set maximum width for better layout
											boxShadow: 5, // Add shadow for depth
										}} >

										<div style={{ fontWeight: 'bold' }}>What do you like most about our services?</div>
										{selectedEnrollment.question3} <br />
									</Typography>

									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '600px', // Set maximum width for better layout
											boxShadow: 5, // Add shadow for depth
										}} >

										<div style={{ fontWeight: 'bold' }}>What areas do you think we can improve?</div>
										{selectedEnrollment.question4} <br />
									</Typography>

									<Typography component="span" variant="subtitle1" textAlign={"left"}
										sx={{
											fontSize: isSmallScreen ? '14px' : '18px', p: 2,
											borderRadius: 3,
											bgcolor: 'background.default',
											display: 'grid',
											gap: 0,
											maxWidth: '600px', // Set maximum width for better layout
											boxShadow: 5, // Add shadow for depth
										}} >

										<div style={{ fontWeight: 'bold' }}>Any additional comments or suggestions?</div>
										{selectedEnrollment.question5} <br />
									</Typography>

								</Box>
							</Grid>
						)
					}
				/> */}

			</Card>
    </div>
  )
}

export default EnrollmentModule