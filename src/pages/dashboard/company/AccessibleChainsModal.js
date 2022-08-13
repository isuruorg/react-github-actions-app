import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { MButton } from '../../../components/@material-extend';

export default function AccessibleChainsModal({ open, onClose, company, chains = [] }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle>{`${company} - Accessible Chains (${chains.length})`}</DialogTitle>
      <DialogContent>
        <List>
          {chains.map((chain) => (
            <div key={chain}>
              <ListItem>
                <ListItemText>
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <RadioButtonCheckedIcon />
                  </ListItemIcon>
                  {chain}
                </ListItemText>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <MButton onClick={onClose} autoFocus color="error" variant="contained">
          Close
        </MButton>
      </DialogActions>
    </Dialog>
  );
}

AccessibleChainsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  company: PropTypes.string,
  chains: PropTypes.array
};
