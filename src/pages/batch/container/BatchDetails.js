import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BatchWiseStudent from "./BatchWiseStudent";
import { useNavigate } from "react-router-dom";
import { Delete, Get, Post } from "../../../services/Http.Service";
import { urls } from "../../../utils/constant";
import { batchActions } from "../batchSliceReducer";
import { Box, FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText } from "@mui/material";
import { feedbackAnsActions } from "../../trainerFeedback/trainerSliceReducer";
import { userActions } from "../../user/userSliceReducer";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { capitalizeFirstLetter } from "../../../component/common/CapitalizeFirstLetter";
import DialogBox from "../../../component/common/DialogBox";

const commonStyle = {
  textAlign: "left",
  paddingLeft: "10px",
  fontSize: "16px",
};

function BatchDetails({ selectedBatch, updateShowBatchDetail, getTrainerName }) {
  const [batch, setBatch] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allUser } = useSelector((store) => store.user);
  const { allBatchWiseStudent } = useSelector((store) => store.feedbackAns);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState(null);

  useEffect(() => {
    Get(`${urls.user}`)
      .then(response => {
        const reversedUsers = response.data.reverse();
        dispatch(userActions.getUser(reversedUsers));
        console.log(reversedUsers);
      })
      .catch(error => console.log("user error: ", error));
  }, []);

  useEffect(() => {
    Get(urls.batchWiseStudent).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getBatchWiseStudent(reverseFeedback));
      setBatch(response.data);
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, []);
  useEffect(() => {
    Get(urls.batchWiseStudent).then(response => {
      const reverseFeedback = response.data.reverse();
      dispatch(feedbackAnsActions.getBatchWiseStudent(reverseFeedback));
      setBatch(response.data);
    }).catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, [snackbar]);

  const calculateLeftDays = (startDate, durationInDays) => {
    if (!startDate || !durationInDays) return "Invalid date or duration";

    const durationNumber = parseInt(durationInDays.replace(/\D/g, ""), 10);

    const startDateObj = new Date(startDate);
    const endDate = new Date(startDateObj);
    endDate.setDate(startDateObj.getDate() + durationNumber);

    const today = new Date();
    const timeDifference = endDate - today;

    if (timeDifference < 0) return 0;

    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return remainingDays;
  };



  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setCheckedStudents(value);
  };

  const getStudentNameById = (studentId) => {
    const student = allUser.find(user => user.id === studentId);
    return student ? `${capitalizeFirstLetter(student.fname)}` : `Student ${studentId}`.join(',');
  };

  const handleSubmit = () => {
    // Check if selectedBatch is defined
    if (!selectedBatch) {

      setSnackbar({ open: true, message: 'Selected batch is undefined', severity: 'error' });
      return;
    }


    // Check if checkedStudents is empty
    if (checkedStudents.length === 0) {
  
      setSnackbar({ open: true, message: 'No students selected', severity: 'warning' });
      return;
    }

    console.log("Selected Batch ID:", selectedBatch.id);
    console.log("Checked Students:", checkedStudents);
    const currentDate = new Date().toISOString().split('T')[0];

    checkedStudents.forEach(studentId => {
      const studentName = getStudentNameById(studentId);
      const isStudentInBatch = allBatchWiseStudent.some(std => std.student.id === studentId && std.batch.id === selectedBatch.id);
      if (isStudentInBatch) {
    
        setSnackbar({ open: true, message: `Student ${studentName} already in the batch`, severity: 'warning' });
      } else {
        const studentData = {
          student_id: studentId,
          batch_id: selectedBatch.id,
          date: currentDate
        };

        console.log("Submitting student data:", studentData);

        Post(urls.batchWiseStudent, studentData)
          .then(response => {
            dispatch(feedbackAnsActions.addBatchwiseStudent(response.data));

            setSnackbar({ open: true, message: `Students added successfully`, severity: 'success' });
          })
          .catch(error => {
    
            setSnackbar({ open: true, message: `Error adding student ${studentId}`, severity: 'error' });
          });
      }
    });
    setCheckedStudents([])
  };
  const handleStudentDelete = () => {
    // Assuming the API endpoint to delete a student from a batch is /batchWiseStudent/:id
    const deleteUrl = `${urls.batchWiseStudent}${deletingRecordId}`;

    Delete(deleteUrl)
      .then((response) => {
        dispatch(feedbackAnsActions.deleteBatchWiseStudent(deletingRecordId));
 
        setSnackbar({ open: true, message: 'Student deleted successfully', severity: 'success' });

        // Update the local state to remove the deleted student
        const updatedStudents = batchStudents.filter(student => student.id !== deletingRecordId);
        setBatch(updatedStudents);
      })
      .catch((error) => {

        setSnackbar({ open: true, message: 'Error deleting student', severity: 'error' });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const goBacktoCourse = () => {
    navigate('/dashboard/batch')
  }
  const deleteExam = (id) => {
    openDeletePopup(id);
  };
  const openDeletePopup = (id) => {
    setIsDeletePopupOpen(true);
    setDeletingRecordId(id);
  };
  //----Function to close the delete popup model-----//
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeletingRecordId(null);
  };

  const batchStudents = allBatchWiseStudent.filter(student => student.batch && student.batch.id === selectedBatch.id);
  const batchStudentIds = new Set(batchStudents.map(student => student.student.id));
  const availableStudents = allUser.filter(data => data.role === 'student' && !batchStudentIds.has(data.id));

console.log(batchStudents);

  return (
    <div>
      <Box
        sx={{
          marginRight: "25px",
          marginTop: 7,
          position: "relative",
          right: 20,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block", textAlign: "left" },
                }}
              >



                Batch Details

              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  textAlign: "end",
                }}
              >
                Batch Start Date:{" "}
                {selectedBatch?.startDate ? selectedBatch?.startDate : "Loading..."}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "0",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
          }}
        >
          <Table aria-label="simple table" sx={{}}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ marginTop: "20px", display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {selectedBatch && (
                      <div>
                        <Typography variant="subtitle1" sx={commonStyle}>
                          Trainer Name: {capitalizeFirstLetter(getTrainerName(selectedBatch?.trainer))}
                        </Typography>
                        <Typography variant="subtitle1" sx={commonStyle}>
                          Course Name: {capitalizeFirstLetter(selectedBatch.course.CourseName)}
                        </Typography>
                        <Typography variant="subtitle1" sx={commonStyle}>
                          Duration In Days: {selectedBatch?.duration_in_days}
                        </Typography>

                        <Typography variant="subtitle1" sx={commonStyle}>
                          Left Days:{" "}
                          {calculateLeftDays(
                            selectedBatch?.startDate,
                            selectedBatch?.duration_in_days
                          )}{" "}
                          days
                        </Typography>
                      </div>
                    )}
                    <div>
                      <Box sx={{ minWidth: 160 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-checkbox-label">Select Students</InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            label='Select Students'
                            value={checkedStudents}
                            onChange={handleChange}
                            renderValue={(selected) => selected.map(studentId => getStudentNameById(studentId)).join(', ')}
                          >
                            {availableStudents.length === 0 ? (
                              <MenuItem disabled value="">
                                <ListItemText primary="None" />
                              </MenuItem>
                            ) : (
                              
                                availableStudents.map((student) => (
                                  <MenuItem key={student.id} value={student.id}>
                                    <Checkbox checked={checkedStudents.indexOf(student.id) > -1} />
                                    <ListItemText primary={`${capitalizeFirstLetter(student.fname)} ${capitalizeFirstLetter(student.lname)}`} />
                                  </MenuItem>
                                ))
                              )}
                          </Select>
                        </FormControl>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                      >
                        Add student
                      </Button>
                    </div>
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    SrNo
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Student Name
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Student Email Id
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Organization Name
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batchStudents.map((student, index) => (
                
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{capitalizeFirstLetter(student.student.fname)} {capitalizeFirstLetter(student.student.lname)}</TableCell>
                  <TableCell>{student.student.email}</TableCell>
                  <TableCell>{student.student.organization}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteExam(student.id)}>
                      <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Button variant="outlined" sx={{ marginTop: 4 }} size="small" onClick={() => updateShowBatchDetail(false)}>Back to Batches</Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <BatchWiseStudent />
        </DialogContent>
      </Dialog>
      <DialogBox
        open={isDeletePopupOpen}
        onClose={closeDeletePopup}
        onConfirm={() => {
          closeDeletePopup();
          handleStudentDelete();
        }}
        show={true}
        message={`Are you sure you want to delete this record?`}
        title={`Delete Record`}
        submitLabel={`Delete`}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default BatchDetails;
