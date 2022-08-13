import { useCallback, useEffect, useMemo, useState } from 'react';

import { Autocomplete, Card, FormControl, Grid, Stack, TextField, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import axios from '../../../utils/axios';
import { getUsers } from '../../../redux/slices/user';
import { MButton, MDatePicker } from '../../../components/@material-extend';
import useChains from '../../../hooks/useChains';
import { useDispatch, useSelector } from '../../../redux/store';
import useDownload from '../../../hooks/useDownload';

const ALL = 'ALL';
const ALL_OPTION = { label: ALL, value: ALL };
const ONE_MONTH_BACK = dayjs().subtract(1, 'months');
const ONE_YEAE_BACK = dayjs().subtract(1, 'year');

export default function PolygonMarkingDetailReport() {
  const [selectedUser, setSelectedUser] = useState(ALL_OPTION);
  const [chain, setChain] = useState();
  const [startDate, setStartDate] = useState(ONE_MONTH_BACK);
  const [endDate, setEndDate] = useState(dayjs());
  const download = useDownload();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.user);
  const { chainOptions } = useChains();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const userOptions = useMemo(() => {
    const options = users.map((user) => ({ value: user._id, label: user.name, email: user.email }));
    return [ALL_OPTION].concat(options);
  }, [users]);

  const downloadReport = useCallback(async () => {
    try {
      const data = {
        chain: chain.value === ALL ? null : chain.value,
        userId: selectedUser.value === ALL ? null : selectedUser.value,
        startDate: startDate.format(),
        endDate: endDate.format()
      };
      const response = await axios.post('/reports/polygonMarkingDetail', data);
      if (response) {
        const fileName = `Polygon-Marking-Summary-Report-Admin-${dayjs().format('YYYY-MM-DD')}`;
        download(fileName, 'csv', response.data);
        enqueueSnackbar(`Downloaded ${fileName}.csv`, {
          variant: 'success',
          autoHideDuration: 4000
        });
      } else {
        enqueueSnackbar('Failed to download report', { variant: 'error', autoHideDuration: 5000 });
      }
    } catch (error) {
      enqueueSnackbar(`Failed to download report: ${error?.error}`, { variant: 'error', autoHideDuration: 5000 });
    }
  }, [startDate, endDate, chain, selectedUser, download, enqueueSnackbar]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ mb: 3 }}>
            Polygon Marking Detail
          </Typography>
          <Stack spacing={{ xs: 2, md: 3 }}>
            <FormControl fullWidth>
              <Autocomplete
                value={chain}
                onChange={(event, newValue) => {
                  setChain(newValue);
                }}
                options={chainOptions}
                disableClearable
                renderInput={(params) => <TextField {...params} label="Chain" />}
              />
            </FormControl>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <MDatePicker
                label="Start Date"
                value={startDate}
                setValue={setStartDate}
                minDate={ONE_YEAE_BACK}
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} sx={{ justifyContent: 'end' }}>
              <MButton
                color="primary"
                size="medium"
                variant="contained"
                disabled={!chain}
                onClick={() => downloadReport()}
              >
                Download
              </MButton>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
