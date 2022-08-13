import { useState } from 'react';
import PropTypes from 'prop-types';

import { filter } from 'lodash';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  TableHead,
  TableBody,
  TextField
} from '@mui/material';

import { useDispatch, useSelector } from '../../redux/store';
import { setSelectedStore } from '../../redux/slices/chain';
import { MButton } from '../../components/@material-extend';
import LoadingScreen from '../../components/LoadingScreen';

const HEADERS = ['Store', 'Address', 'Polygons', ''];
const SEARCH_HEADERS = ['Store', 'Address'];

function applySortFilter(array = [], field, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (field && query) {
    return filter(array, (_user) => _user[field].toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SearchStoresModal({ open, onClose }) {
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const dispatch = useDispatch();
  const { isLoading, storesForChain } = useSelector((state) => state.chain);
  const filteredStores = applySortFilter(storesForChain, filterField.toLowerCase(), filterValue);
  const loading = isLoading && !filteredStores;

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>Search Store</DialogTitle>
      <DialogContent>
        <DialogContentText>Search a specific store to load on map</DialogContentText>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 10
          }}
        >
          {loading ? (
            <LoadingScreen />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {HEADERS.map((header, index) => (
                      <TableCell key={`${header}-${index}`}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableRow>
                  {HEADERS.map((header) => (
                    <TableCell key={header}>
                      {SEARCH_HEADERS.includes(header) && (
                        <TextField
                          value={header === filterField ? filterValue : ''}
                          placeholder="Search"
                          variant="standard"
                          onChange={(e) => {
                            setFilterField(header);
                            setFilterValue(e.target.value);
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableBody>
                  {filteredStores.map(({ _id, store, address, geoCode }) => (
                    <TableRow key={`${store}-${address}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {store}
                      </TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>{geoCode?.general?.features?.length || 0}</TableCell>
                      <TableCell>
                        <MButton
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            dispatch(setSelectedStore(_id));
                            onClose();
                          }}
                        >
                          Load
                        </MButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} sx={{ mt: 2 }}>
          <MButton color="error" size="medium" variant="contained" onClick={onClose}>
            Close
          </MButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

SearchStoresModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
