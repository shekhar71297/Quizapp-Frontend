import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { AppBar, FormControl, InputLabel, MenuItem, Select, Toolbar, Typography, Button, Snackbar } from '@mui/material';
import { Box } from '@mui/material';
import { capitalizeFirstLetter } from '../../../component/common/CapitalizeFirstLetter';
import { Get, Post, Put } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { feedbackAnsActions } from '../trainerSliceReducer';
import MuiAlert from '@mui/material/Alert';
import { Subject } from '@mui/icons-material';

const ScheduleFeedback = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [severity, setSeverity] = useState("success");
	const dispatch = useDispatch();
	const { allScheduledFeedback, allBatch, allBatchWiseStudent } = useSelector((store) => store.feedbackAns);
	const [selectedBatch, setSelectedBatch] = useState('');
	const [batchStartDate, setBatchStartDate] = useState(null);
	const [batchDuration, setBatchDuration] = useState(null);
	const [showSubmitButton, setShowSubmitButton] = useState(true);
	const [isEmailSent, setIsEmailSent] = useState(false);

	useEffect(() => {
		const fetchScheduledFeedback = async () => {
			try {
				const response = await Get(urls.scheduled);
				const reverseFeedback = response.data.reverse();
				dispatch(feedbackAnsActions.getScheduledFeedback(reverseFeedback));
			} catch (error) {
				console.error('Error fetching feedback:', error);
			}
		};

		fetchScheduledFeedback();
	}, [dispatch]);

	useEffect(() => {
		const fetchBatchData = async () => {
			try {
				const response = await Get(urls.batch);
				const reverseBatch = response.data.reverse();
				dispatch(feedbackAnsActions.getBatch(reverseBatch));
			} catch (error) {
				console.error('Error fetching batch data:', error);
			}
		};

		fetchBatchData();
	}, [dispatch]);

	useEffect(() => {
		const fetchBatchWiseStudents = async () => {
			try {
				const response = await Get(urls.batchWiseStudent);
				dispatch(feedbackAnsActions.getBatchWiseStudent(response.data));
			} catch (error) {
				console.error('Error fetching batch wise students:', error);
			}
		};

		fetchBatchWiseStudents();
	}, [dispatch]);

	useEffect(() => {
		if (selectedBatch) {
			const existingFeedbackForBatch = allScheduledFeedback.find(feedback => feedback.batch.batchname === selectedBatch);
			if (existingFeedbackForBatch) {
				setShowSubmitButton(false);
				setSnackbarOpen(true);
				setSeverity('error');
				setSnackbarMessage('Feedback is already scheduled for this batch.');
			} else {
				setShowSubmitButton(true);
			}
		}
	}, [selectedBatch, allScheduledFeedback]);
	const sendEmails = async () => {
		const currentDate = new Date().toISOString().split('T')[0];

		const matchingBatches = allScheduledFeedback.filter(feedback => (
			(feedback.feedback1 === currentDate && feedback.status1 === 'pending') ||
			(feedback.feedback2 === currentDate && feedback.status2 === 'pending') ||
			(feedback.feedback3 === currentDate && feedback.status3 === 'pending') ||
			(feedback.feedback4 === currentDate && feedback.status4 === 'pending')
		)).map(feedback => feedback.batch.batchname);

		if (matchingBatches.length === 0) {
			console.log('No batches found with pending feedback for the current date.');
			return;
		}

		const WebLink = 'http://feedback-fe.hematitecorp.com'
		const studentEmails = allBatchWiseStudent
			.filter(data => matchingBatches.includes(data.batch.batchname))
			.map(studentData => studentData.student.email);

			try {
						await Post(urls.sendEmail, {
							to: studentEmails,
							subject: 'Feedback Scheduled',
							message: `Dear Student,\n\nFeedback has been scheduled for your batch:\n\n${WebLink}\n\nPlease complete it at your earliest convenience.\n\nBest regards,\nHematite Infotech Pvt Ltd.`
						});
						console.log('Email sent successfully');
					} catch (error) {
						console.error('Error sending email:', error);
					}
;
		

		const updatedFeedback = allScheduledFeedback.map(feedback => {
			if (matchingBatches.includes(feedback.batch.batchname)) {
				return {
					...feedback,
					status1: feedback.feedback1 === currentDate ? 'Done' : feedback.status1,
					status2: feedback.feedback2 === currentDate ? 'Done' : feedback.status2,
					status3: feedback.feedback3 === currentDate ? 'Done' : feedback.status3,
					status4: feedback.feedback4 === currentDate ? 'Done' : feedback.status4
				};
			}
			return feedback;
		});

		for (const feedback of updatedFeedback) {
			try {
				await Put(`${urls.scheduled}${feedback.id}/`, feedback);
				dispatch(feedbackAnsActions.updateScheduledFeedback(feedback));
			} catch (error) {
				console.error("Error updating feedback status: ", error);
			}
		}
	};

	useEffect(() => {
		if (allScheduledFeedback.length > 0 && allBatchWiseStudent.length > 0 && !isEmailSent) {
			sendEmails();
			setIsEmailSent(true);
		}
	}, [allScheduledFeedback]);

	const closeSnackbar = () => {
		setSnackbarOpen(false);
		setSnackbarMessage('');
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleBatchChange = event => {
		setSelectedBatch(event.target.value);
		setPage(0);
	};

	const calculateFeedbackDates = (startDate, duration) => {
		const feedbackDates = [];
		if (startDate && duration) {
			startDate = new Date(startDate);
			duration = parseInt(duration.split(' ')[0], 10);
			for (let i = 1; i <= 4; i++) {
				const feedbackDate = new Date(startDate.getTime() + (i * (duration / 4) * 24 * 60 * 60 * 1000));
				feedbackDates.push(feedbackDate.toISOString().split('T')[0]);
			}
		}
		return feedbackDates;
	};

	const handleSubmit = async () => {
		if (!selectedBatch) return;

		try {
			const response = await Get(urls.batch);
			const reverseBatch = response.data.reverse();
			dispatch(feedbackAnsActions.getBatch(reverseBatch));

			const selectedBatchData = reverseBatch.find(batch => batch.batchname === selectedBatch);
			if (selectedBatchData) {
				setBatchStartDate(selectedBatchData.startDate);
				setBatchDuration(selectedBatchData.duration_in_days);

				const feedbackDates = calculateFeedbackDates(selectedBatchData.startDate, selectedBatchData.duration_in_days);
				await postData(feedbackDates, selectedBatchData.id);
			}
		} catch (error) {
			console.error('Error fetching batch:', error);
		}
	};

	const postData = async (feedbackDates, batchId) => {
		const postData = {
			feedback1: feedbackDates[0],
			status1: 'pending',
			feedback2: feedbackDates[1],
			status2: 'pending',
			feedback3: feedbackDates[2],
			status3: 'pending',
			feedback4: feedbackDates[3],
			status4: 'pending',
			batch_id: batchId
		};
		try {
			const response = await Post(urls.scheduled, postData);
			dispatch(feedbackAnsActions.addScheduledFeedback(response.data));
			console.log('Feedback data posted successfully:', response.data);
		} catch (error) {
			console.error('Error posting feedback data:', error);
		}
	};

	return (
		<>
			<Box sx={{ marginRight: '25px', marginTop: 7, position: 'relative', right: 20 }}>
				<Box sx={{ flexGrow: 1 }}>
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
								Schedule Feedback
							</Typography>
						</Toolbar>
					</AppBar>
				</Box>
				<Box sx={{ display: 'flex', marginTop: 2, justifyContent: 'center' }}>
					<FormControl size="small" sx={{ marginLeft: '20px' }}>
						<InputLabel id="select-batch-label">Select Batch</InputLabel>
						<Select
							labelId="select-batch-label"
							id="select-batch"
							value={selectedBatch}
							onChange={handleBatchChange}
							style={{ backgroundColor: 'white', width: '150px', height: '40px' }}
							label="Select Batch"
						>
							{allBatch?.map(data => (
								<MenuItem key={data.id} value={data.batchname}>
									{capitalizeFirstLetter(data.batchname)}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box sx={{ display: 'flex', marginLeft: 5 }}>
						{showSubmitButton && (
							<Button onClick={handleSubmit} variant="contained" sx={{ height: '40px' }}>
								Schedule
							</Button>
						)}
					</Box>
				</Box>
				<Paper sx={{ width: '100%', marginTop: 5 }}>
					<TableContainer sx={{ maxHeight: 440 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									<TableCell>Batch Name</TableCell>
									<TableCell>Feedback 1</TableCell>
									<TableCell>Status 1</TableCell>
									<TableCell>Feedback 2</TableCell>
									<TableCell>Status 2</TableCell>
									<TableCell>Feedback 3</TableCell>
									<TableCell>Status 3</TableCell>
									<TableCell>Feedback 4</TableCell>
									<TableCell>Status 4</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{allScheduledFeedback.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
										<TableCell>{capitalizeFirstLetter(row.batch.batchname)}</TableCell>
										<TableCell>{row.feedback1}</TableCell>
										<TableCell>{row.status1}</TableCell>
										<TableCell>{row.feedback2}</TableCell>
										<TableCell>{row.status2}</TableCell>
										<TableCell>{row.feedback3}</TableCell>
										<TableCell>{row.status3}</TableCell>
										<TableCell>{row.feedback4}</TableCell>
										<TableCell>{row.status4}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={allScheduledFeedback.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<MuiAlert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
		</>
	);
};

export default ScheduleFeedback;
