import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img src="/static/traceclawLogo.png" alt="TraceClaw" width="100%" height="100%" loading="lazy" />
    </Box>
  );
}
