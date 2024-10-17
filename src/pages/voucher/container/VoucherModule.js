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
import Switch from '@mui/material/Switch';
import { Box, Card, CardContent } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import * as TablePaginationActions from '../../../component/common/TablePaginationActions';
import { Get, Put } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { generateRandomVoucherCode } from '../../../services/dom.service';
import { voucherActions } from '../voucherSliceReducer';

function VoucherModule() {
  const [switchIndex, setSwitchIndex] = useState(null);
  const [status, setStatus] = useState(true);
  const [vcodes, setVcodes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedId, setSelectedId] = useState(null);
  const { allvouchers } = useSelector((store) => store.voucher);
  const dispatch = useDispatch();

  //-----------------Dispatch calls-------------------------//
  useEffect(() => {
    Get(urls.voucher).then(response => dispatch(voucherActions.GET_VOUCHER(response.data)))
      .catch((error) => {
        console.error('Error fetching vouchers:', error);
      });
  }, [])
  useEffect(() => {

    const randomCodeInterval = setInterval(() => {
      if (!status && selectedId !== null) {
        const newRandomCode = generateRandomVoucherCode();
        updateVoucherCodeInDatabase(selectedId, newRandomCode);
      }
    }, 3600000); // 3600000 milliseconds = 1 hour

    return () => {
      clearInterval(randomCodeInterval);
    };
  }, [status, selectedId]);

  useEffect(() => {
    setVcodes(allvouchers);
  }, [allvouchers]);
  //------------------------to update voucher code in database-------------------------//
  const updateVoucherCodeInDatabase = (id, newCode) => {
    const updatedVcodes = [...vcodes];
    const voucherIndex = updatedVcodes.findIndex((voucher) => voucher.id === id);

    if (voucherIndex !== -1) {
      updatedVcodes[voucherIndex].Vcode = newCode;
      setVcodes(updatedVcodes);
    }
  };
  //-----------------------handle toggle button ------------------//
  const handleChange = (index, status, id, event) => {
    // Calculate the index of the data item being modified based on pagination
    const dataIndex = page * rowsPerPage + index;

    // Update state using the previous state with a functional update
    setVcodes(prevVcodes => {
      // Create a copy of the previous state array
      const updatedVcodes = prevVcodes.map((voucher, i) =>
        i === dataIndex ? { ...voucher, status: !status } : voucher
      );

      // If the status is now false, generate a new random voucher code
      if (!updatedVcodes[dataIndex].status) {
        const newRandomCode = generateRandomVoucherCode();
        // Update the voucher code for the current data item
        updatedVcodes[dataIndex].Vcode = newRandomCode;
      }

      // Set the selected ID to the ID of the current data item
      setSelectedId(updatedVcodes[dataIndex].id);
      // Set the status to the updated status of the current data item
      setStatus(updatedVcodes[dataIndex].status);

      // Update the voucher in the backend (asynchronously)
      Put(`${urls.voucher}${vcodes[dataIndex].id}/`, updatedVcodes[dataIndex])
        .then(response => dispatch(voucherActions.UPDATE_VOUCHER(response.data)))
        .catch(error => console.log("voucher error: ", error));

      // Return the updated state array
      return updatedVcodes;
    });
  };
  //---------------------------handle pagination-----------------------//
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                Manage Voucher
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <CardContent sx={{ borderRadius: 'none' }}  >
          <TableContainer component={Paper} sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Voucher Code</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vcodes && vcodes.length > 0 && vcodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                  const currentIndex = page * rowsPerPage + index + 1;
                  return (
                    <TableRow key={data.id}>
                      <TableCell align="left" component="th" scope="row">{currentIndex}</TableCell>
                      <TableCell align="left">{data.Vcode}</TableCell>
                      <TableCell align="left">
                        <Switch
                          key={index}
                          checked={data.status}
                          onChange={(e) => handleChange(index, data.status)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={6}
              count={vcodes.length}
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
      </Card>
    </div>
  );
}

export default VoucherModule;
