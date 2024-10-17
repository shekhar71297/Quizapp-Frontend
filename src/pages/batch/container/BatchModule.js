import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import SchoolIcon from "@mui/icons-material/School";
import BatchDetails from "./BatchDetails";
import { batchActions } from "../batchSliceReducer";
import { Get } from "../../../services/Http.Service";
import { urls } from "../../../utils/constant";
import { experimentalStyled as styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../../component/common/CapitalizeFirstLetter";
import AddBatch from "./AddBatch";
import { useNavigate } from "react-router-dom";

function BatchModule() {
  const [batch, setBatch] = useState([]);
  const [showBatchDetail, updateShowBatchDetail] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [batchDetail, updateBatchDetail] = useState({});
  const [selectedBatch, updateSelectedBatch] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [batchCountByCourse, setBatchCountByCourse] = useState({});
  const [showAddBatch, setShwAddBatch] = useState(false);
  const nav = useNavigate();

  const getGreeting = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Morning";
    } else if (currentTime < 18) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const handleBatchClick = (batch) => {
    updateSelectedBatch(batch);
    updateShowBatchDetail(true);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    filterBatchesByCourse(course.id);
    updateShowBatchDetail(false); // Switch to batch list view
  };

  const { allBatches } = useSelector((store) => store.batch);
  const { allCourse } = useSelector((store) => store.batch);
  const dispatch = useDispatch();

  useEffect(() => {
    Get(urls.course)
      .then((response) => dispatch(batchActions.Get_Course(response.data)))
      .catch((error) => console.log("Batch error: ", error));
  }, []);

  useEffect(() => {
    Get(urls.batch)
      .then((response) => dispatch(batchActions.GET_BATCH(response?.data?.reverse())))
      .catch((error) => console.log("Batch error: ", error));
  }, []);

  useEffect(() => {
    if (allBatches && allBatches.length > 0) {
      setBatch([...allBatches]);
      setBatchCountByCourse(getBatchCountByCourse(allBatches));
    }
  }, [allBatches]);

  const getTrainerName = (trainer) => {
    let name = "";
    const { fname = "", lname = "" } = trainer;
    if (fname && lname) {
      name = `${fname} ${lname}`;
    }
    return name;
  };

  const getBatchCountByCourse = (batches) => {
    return batches.reduce((acc, batch) => {
      const courseId = batch?.course?.id;
      if (!acc[courseId]) {
        acc[courseId] = 0;
      }
      acc[courseId]++;
      return acc;
    }, {});
  };

  const filterBatchesByCourse = (courseId) => {
    const batches = allBatches.filter(batch => batch?.course?.id === courseId);
    setFilteredBatches(batches);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const handleAddBatch = () => {
    nav('/dashboard/manage-batch');
  }

  return (
    <React.Fragment>
      <CssBaseline />

      {!showBatchDetail && !selectedCourse && (
        <Card sx={{ marginRight: "25px", marginTop: 7, position: "relative", right: 20, borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar component='nav' position="static" sx={{ boxShadow: 'none', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
              <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{ textAlign: "left", fontSize: "24px" }}
                  >
                    Manage Batch
                  </Typography>
                </div>
                <div>
                  <Button type="button" variant="outlined" size="small" color="inherit" onClick={handleAddBatch}>All Batch</Button>
                </div>
              </Toolbar>
            </AppBar>
          </Box>
          <CardContent sx={{ borderRadius: 'none' }}>
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              {allCourse.length > 0 ? (
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {allCourse.map((item, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <Item onClick={() => handleCourseClick(item)}>
                        <AppBar position="static" sx={{ height: "50px" }}>
                          <Toolbar sx={{ justifyContent: "center" }}>
                            <Typography variant="h6" noWrap component="div" sx={{ display: "flex", flexDirection: 'row' }}>
                              <div style={{ marginRight: '10px' }}> <SchoolIcon sx={{ fontSize: "25px" }} /></div>
                              <div style={{ fontSize: '16px' }}>{capitalizeFirstLetter(item?.CourseName)}</div>
                            </Typography>
                          </Toolbar>
                        </AppBar>
                        <div style={{ padding: '20px' }}>
                          <span>Batch count: {batchCountByCourse[item?.id] || 0}</span>
                        </div>
                      </Item>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="h6" align="center">No Courses Available</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {!showBatchDetail && selectedCourse && (
        <Box sx={{ flexGrow: 1, marginTop: 7, marginRight: '25px', marginLeft: '-17px' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                sx={{ textAlign: "center", fontSize: "24px" }}
              >
                Batches for {capitalizeFirstLetter(selectedCourse.CourseName)}
              </Typography>
            </Toolbar>
          </AppBar>

          {filteredBatches.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Batch Name</TableCell>
                    <TableCell>Trainer</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBatches.map((batch, index) => (
                    <TableRow key={index} onClick={() => handleBatchClick(batch)}>
                      <TableCell>{batch.batchname}</TableCell>
                      <TableCell>{getTrainerName(batch.trainer)}</TableCell>
                      <TableCell>{batch.startDate}</TableCell>
                      <TableCell>{batch.duration_in_days}</TableCell>
                      <TableCell><Button variant="outlined" color="success" size="small">See Students</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>No Batches Found</Typography>
          )}
          <Button variant="outlined" sx={{ marginTop: 4 }} size="small" onClick={() => setSelectedCourse(null)}>Back to Courses</Button>
        </Box>
      )}

      {showBatchDetail && (
        <BatchDetails
          selectedBatch={selectedBatch}
          getTrainerName={getTrainerName}
          updateShowBatchDetail={updateShowBatchDetail}
        />
      )}
    </React.Fragment>
  );
}

export default BatchModule;
