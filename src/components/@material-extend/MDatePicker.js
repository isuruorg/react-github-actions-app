import React from 'react';
import PropTypes from 'prop-types';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from '@material-ui/core';
import dayjs from 'dayjs';

import { YYYYMMDD_SLASH } from '../../utils/time';

export default function MDatePicker({
  label = 'Date',
  value = dayjs(),
  minDate = dayjs().subtract(1, 'months'),
  maxDate = dayjs(),
  setValue = () => {}
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat={YYYYMMDD_SLASH}
        minDate={minDate}
        maxDate={maxDate}
        value={value}
        onChange={setValue}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  );
}

MDatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  setValue: PropTypes.func
};
