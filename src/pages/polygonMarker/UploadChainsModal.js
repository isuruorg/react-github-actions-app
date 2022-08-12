import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack';

import axios from '../../utils/axios';
import { MButton, MIconButton } from '../../components/@material-extend';

import UploadSingleFile from '../../components/upload/UploadSingleFile';

export default function UploadChainsModal({ open, onClose }) {
  const [file, setFile] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // eslint-disable-next-line
  const uploadChainCSV = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('/stores', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data) {
        const { data, error } = response.data;
        if (error) {
          enqueueSnackbar(`Upload failed due to ${error}`, { variant: 'error' });
          return 0;
        }
        const { created, duplicates } = data;
        const totalCreated = created.length;
        const totalDups = duplicates.length;
        enqueueSnackbar(
          `Created ${totalCreated} records and skipped ${totalDups} records from total ${
            totalDups + totalCreated
          } records`,
          {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
            autoHideDuration: 7000
          }
        );
        onClose();
        return 0;
      }
    } catch (error) {
      enqueueSnackbar(`Upload failed due to ${error.error}`, { variant: 'error' });
    }
  };

  return (
    <>
      <Dialog fullWidth open={open} onClose={onClose}>
        <DialogTitle>Upload Chain CSV</DialogTitle>
        <DialogContent>
          <DialogContentText>Upload CSV file containing chains</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: 10
            }}
          >
            {/* <input type="file" onChange={(file) => setFile(file)} /> */}
            <UploadSingleFile
              placeholder={file ? file.path : 'Drop or select Chain CSV'}
              file={file}
              onDrop={(files) => setFile(files[0])}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} sx={{ mt: 2 }}>
            <MButton
              color="error"
              size="medium"
              variant="contained"
              // endIcon={<HeightIcon />}
              onClick={onClose}
            >
              Close
            </MButton>
            <MButton color="primary" size="medium" variant="contained" disabled={!file} onClick={uploadChainCSV}>
              Upload
            </MButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

UploadChainsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
