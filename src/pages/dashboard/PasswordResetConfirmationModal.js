import PropTypes from 'prop-types';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import axios from '../../utils/axios';
import { MButton } from '../../components/@material-extend';

export default function PasswordResetConfirmationModal({ open, onClose, user }) {
  const { enqueueSnackbar } = useSnackbar();
  const resetPassword = async () => {
    try {
      const response = await axios.post(`/users/password/default/${user._id}`);

      if (response.data.data) {
        enqueueSnackbar(`Password reset success for ${user.name}`, { variant: 'success' });
      } else {
        enqueueSnackbar(`Password reset failed: ${response.data.error}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`${error.error}`, { variant: 'error' });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Reset password for ${user.name} (${user.email})?`}</DialogContentText>
        <DialogContentText sx={{ color: 'teal' }}>
          *This will override the existing password and set the default password.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MButton color="error" variant="contained" onClick={onClose}>
          Cancel
        </MButton>
        <MButton color="primary" variant="contained" onClick={resetPassword}>
          Confirm
        </MButton>
      </DialogActions>
    </Dialog>
  );
}

PasswordResetConfirmationModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object
};
