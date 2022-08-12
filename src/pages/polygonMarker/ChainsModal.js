import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import dayjs from 'dayjs';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useSnackbar } from 'notistack';

import { admin } from '../../utils/userRoles';
import axios from '../../utils/axios';
import { getChains, getNextStore, updateSkipped } from '../../redux/slices/chain';
import LoadingScreen from '../../components/LoadingScreen';
import useAuth from '../../hooks/useAuth';
import useDownload from '../../hooks/useDownload';
import { useDispatch, useSelector } from '../../redux/store';

const HEADERS = ['Chain', 'Locations', 'Datamart Locations', 'Marked %', 'Transferred (%)', 'Actions'];

const formatPercentage = (value) => (Number.isInteger(value) ? `${value}%` : `${value.toFixed(3)}%`);

export default function ChainsModal({ open, onClose }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const { isLoading, chains = [], totalChains } = useSelector((state) => state.chain);
  const { user } = useAuth();
  const download = useDownload();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getChains(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const onSelect = (chain) => {
    dispatch(getNextStore(chain, 0));
    dispatch(updateSkipped(0));
    onClose();
  };

  const downloadMarkedData = async (chain) => {
    try {
      const response = await axios.post('/stores/chains/marked', { chain });
      if (response) {
        const fileName = `${chain}-marked_geoCode-${dayjs().format('YYYY-MM-DD')}`;
        download(fileName, 'json', JSON.stringify(response.data));
        enqueueSnackbar(`Downloaded ${fileName}.json`, {
          variant: 'success',
          autoHideDuration: 4000
        });
        onClose();
      } else {
        enqueueSnackbar('Failed to download marked JSON', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Failed to download marked JSON: ${error?.error}`, { variant: 'error', autoHideDuration: 5000 });
    }
  };

  return (
    <div>
      <Dialog fullWidth open={open} maxWidth="lg" onClose={onClose}>
        <DialogTitle>Select Chain</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a Chain to start marking polygons</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {HEADERS.map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chains.map((data) => (
                      <TableRow key={data.chain} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {data.chain}
                        </TableCell>
                        <TableCell>{data.count}</TableCell>
                        <TableCell>{data.transferedDataMarts}</TableCell>
                        <TableCell> {formatPercentage(data.percentage)}</TableCell>
                        <TableCell>{formatPercentage(data.transferedDatamartPercentage)}</TableCell>
                        <TableCell>
                          <Button onClick={() => onSelect(data.chain)}>Select</Button>
                          {user?.role === admin && (
                            <>
                              <IconButton color="secondary" onClick={() => downloadMarkedData(data.chain)}>
                                <FileDownloadOutlinedIcon />
                              </IconButton>
                              <IconButton disabled color="error">
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </>
                          )}
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
          <TablePagination
            component="div"
            count={totalChains}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

ChainsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
