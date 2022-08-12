import * as React from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';

import { YYYYMMDD_SLASH } from '../../../utils/time';

DatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  format: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string
};

export default function DatePicker({
  label = 'Date',
  value,
  handleChange,
  format = 'MM/dd/yyyy',
  minDate = dayjs().format(YYYYMMDD_SLASH),
  maxDate
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label={label}
          inputFormat={format}
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
