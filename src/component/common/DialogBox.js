import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
const DialogBox = ({ open, onClose, onConfirm, message, title, content, submitLabel, show ,disable,showCancel=true}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontSize: '18px', display: "flex", justifyContent: "space-between" }}>{title}
        <CancelIcon onClick={onClose} style={{ fontSize: '25px' }} />
      </DialogTitle>
      <DialogContent>
        {content}
        <DialogContentText sx={{marginTop:3}}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {showCancel?
        <Button variant='outlined' size='small' onClick={onClose} sx={{ marginRight: 2 }}>Cancel</Button>
        :null}

        {show && (
          <Button onClick={onConfirm} size='small' variant='contained' color="primary" disabled={disable}>
            {submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
