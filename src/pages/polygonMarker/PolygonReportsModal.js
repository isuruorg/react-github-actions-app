import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import axios from '../../utils/axios';
import { getUsers } from '../../redux/slices/user';
import { MButton, MDatePicker } from '../../components/@material-extend';
import { POLYGON_REPORT_TYPES_OPTIONS } from '../../utils/reportTypes';
import useChains from '../../hooks/useChains';
import { useDispatch, useSelector } from '../../redux/store';
import useDownload from '../../hooks/useDownload';

const ALL = 'ALL';
const ALL_OPTION = { label: ALL, value: ALL };
const ONE_MONTH_BACK = dayjs().subtract(1, 'months');

export default function PolygonReportsModal({ open, onClose }) {
  const [type, setType] = useState(POLYGON_REPORT_TYPES_OPTIONS[0].value);
  const [selectedUser, setSelectedUser] = useState(ALL_OPTION);
  const [chain, setChain] = useState(ALL_OPTION);
  const [startDate, setStartDate] = useState(ONE_MONTH_BACK);
  const [endDate, setEndDate] = useState(dayjs());
  const download = useDownload();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.user);
  const { chainOptions } = useChains();

  useEffect(() => {
    dispatch(getUsers());
    // dispatch(getChains);
  }, [dispatch]);

  const userOptions = useMemo(() => {
    const options = users.map((user) => ({ value: user._id, label: user.name, email: user.email }));
    return [ALL_OPTION].concat(options);
  }, [users]);

  const downloadReport = useCallback(async () => {
    const url = `/reports/polygon/${type}`;
    try {
      const data = {
        chain: chain.value === ALL ? null : chain.value,
        userId: selectedUser.value === ALL ? null : selectedUser.value,
        startDate: startDate.format(),
        endDate: endDate.format()
      };
      const response = await axios.post(url, data);
      if (response) {
        const fileName = `Normal-Polygon-Report-${dayjs().format('YYYY-MM-DD')}`;
        download(fileName, 'csv', response.data);
        enqueueSnackbar(`Downloaded ${fileName}.csv`, {
          variant: 'success',
          autoHideDuration: 4000
        });
        onClose();
      } else {
        enqueueSnackbar('Failed to download report', { variant: 'error', autoHideDuration: 5000 });
      }
    } catch (error) {
      enqueueSnackbar(`Failed to download report: ${error?.error}`, { variant: 'error', autoHideDuration: 5000 });
    }
  }, [type, startDate, endDate, chain, selectedUser, download, enqueueSnackbar, onClose]);

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <DialogTitle>Polygon Reports</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a Report type to downnload report as CSV</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '20vw'
            }}
          >
            {type !== POLYGON_REPORT_TYPES_OPTIONS[0].value && (
              <Alert severity="warning" sx={{ mt: 4 }}>
                Report type not supported yet.
              </Alert>
            )}
            <FormControl fullWidth sx={{ mt: 4, minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="User" onChange={(event) => setType(event.target.value)}>
                {POLYGON_REPORT_TYPES_OPTIONS.map((reportType) => (
                  <MenuItem key={reportType.value} value={reportType.value}>
                    {reportType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2, minwidth: 120 }}>
              <Autocomplete
                value={chain}
                onChange={(event, newValue) => {
                  setChain(newValue);
                }}
                options={[ALL_OPTION].concat(chainOptions)}
                disableClearable
                renderInput={(params) => <TextField {...params} label="Chain" />}
              />
            </FormControl>
            {type === POLYGON_REPORT_TYPES_OPTIONS[0].value && (
              <>
                <FormControl fullWidth sx={{ mt: 2, minwidth: 120 }}>
                  <Autocomplete
                    value={selectedUser}
                    onChange={(event, newValue) => {
                      setSelectedUser(newValue);
                    }}
                    options={userOptions}
                    disableClearable
                    renderInput={(params) => <TextField {...params} label="User" />}
                  />
                </FormControl>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} sx={{ mt: 2 }}>
                  <MDatePicker
                    label="Start Date"
                    value={startDate}
                    setValue={setStartDate}
                    minDate={ONE_MONTH_BACK}
                    maxDate={endDate}
                  />
                  <MDatePicker
                    label="End Date"
                    value={endDate}
                    setValue={setEndDate}
                    minDate={startDate}
                    maxDate={dayjs()}
                  />
                </Stack>
              </>
            )}
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
            <MButton
              color="primary"
              size="medium"
              variant="contained"
              disabled={type !== POLYGON_REPORT_TYPES_OPTIONS[0].value}
              onClick={() => downloadReport()}
            >
              Download
            </MButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

PolygonReportsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
