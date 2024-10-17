import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AppBar, Toolbar } from '@mui/material';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import IconButton from '@mui/material/IconButton';
import { IoMdLogOut } from 'react-icons/io';
import CustomAppBar from '../../../component/common/CustomAppBar';
import DialogBox from '../../../component/common/DialogBox';
import { useNavigate } from 'react-router-dom';
import { Get } from '../../../services/Http.Service';
import { urls } from '../../../utils/constant';
import { voucherActions } from '../voucherSliceReducer';
import SelectExam from '../../exam/container/SelectExam';
import logoimg from '../../../asset/img/Hematite Logo.jpg'

function VoucherValidation() {
    const [Vcode, setVcode] = useState("");
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('info');
    const { allvouchers } = useSelector((store) => store.voucher);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const currentYear = new Date().getFullYear();
    const copyrightText = `© 2017-${currentYear} Hematite Infotech, All Rights Reserved.`;

    useEffect(() => {
        Get(urls.voucher).then(response => dispatch(voucherActions.GET_VOUCHER(response.data)))
            .catch((error) => {
                console.error('Error fetching vouchers:', error);
            });
    }, [])

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setVcode(value);
    };

    const handleLogout = () => {
        setAlertSeverity('warning'); // or 'info', 'error', etc. based on your needs
        setAlertMessage(`Are you sure you want to logout ?`);
        setShowAlert(true);
    };

    const submitBtn = (e) => {
        e.preventDefault();

        const istrue = allvouchers.some((d) =>
            Vcode === d.Vcode && d.status === true
        );
        if (istrue) {
            sessionStorage.setItem("Voucher", "true");
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Valid voucher code');

            setTimeout(() => {
                setIsSnackbarOpen(false);
                setIsValid(true);
            }, 1000);
        } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Enter valid voucher');
        }

    };

    return (
        <div>
            <AppBar color='primary' position="sticky">
                <Toolbar >

                    <div style={{ display: 'flex', marginRight: '10px' }} >
                        <img style={{ width: isSmallScreen ? '40px' : "50px", height: isSmallScreen ? '36px' : "46px", borderRadius: "64%", boxShadow: "white 0px 0px 6px -1px" }} src={logoimg} alt="logoimg" />
                    </div>
                    <Typography sx={{ flexGrow: 1, textAlign: 'left', width: '90px', fontSize: isSmallScreen ? '13px' : '20px' }} >
                        Hematite Infotech Online-Quiz
                    </Typography>
                    <Button sx={{ marginLeft: '15px' }} onClick={handleLogout} size='small' variant='outlined' color="inherit" >
                        Logout
                    </Button>
                    
                </Toolbar>
            </AppBar>
            {isValid ? (
                <SelectExam />
            ) : (
                <>

                    <Container component="main" maxWidth="xs">
                        <CssBaseline />

                        <Box
                            sx={{
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: '0px 0px 7px black',
                                borderRadius: "10px",
                                border: 'none',
                            }}
                        >
                            <VpnKeyIcon color='primary' style={{ fontSize: '50px' }} />
                            <Typography sx={{ color: 'primary.main', fontSize: isSmallScreen ? '18px' : '20px' }}>
                                Enter Voucher Code
                            </Typography>
                            <Box component="form" onSubmit={submitBtn} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="code"
                                    label="Enter Voucher code"
                                    name="Vcode"
                                    autoFocus
                                    size='small'
                                    onChange={inputChangeHandler}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={submitBtn}
                                >
                                    submit
                                </Button>
                            </Box>
                        </Box>
                    </Container>

                    {/* Snackbar */}
                    <Snackbar
                        open={isSnackbarOpen}
                        autoHideDuration={3000} // You can adjust the duration as needed
                        onClose={() => setIsSnackbarOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setIsSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </>
            )}
            <CustomAppBar title={copyrightText} />
            <DialogBox
                open={showAlert}
                onClose={() => setShowAlert(false)}
                show={true}
                onConfirm={() => {
                    setShowAlert(false);
                    sessionStorage.removeItem("role");
                    sessionStorage.removeItem("studentId");
                    sessionStorage.removeItem("examId");
                    sessionStorage.removeItem("Voucher");
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("accessToken");
                    navigate("/");
                }}
                title={`Confirmation`}
                message={alertMessage}
                submitLabel={`Logout`}
            />
        </div>
    );
}

export default VoucherValidation
