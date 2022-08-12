import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Paper,
  TableHead
} from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getChains } from '../../../redux/slices/chain';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import ChainMoreMenu from './ChainMoreMenu';
import UploadChainsModal from '../../polygonMarker/UploadChainsModal';
// ----------------------------------------------------------------------

const HEADERS = ['Chain', 'Locations', 'Datamart Locations', 'Marked %', 'Transferred (%)', 'Actions'];

// ----------------------------------------------------------------------
const formatPercentage = (value) => (Number.isInteger(value) ? `${value}%` : `${value.toFixed(3)}%`);

export default function Chains() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showUploadChainsModal, setShowUploadChainsModal] = useState(false);
  const { chains = [], totalChains } = useSelector((state) => state.chain);

  useEffect(() => {
    dispatch(getChains(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  return (
    <Page title="TraceClaw | Chains">
      {showUploadChainsModal && (
        <UploadChainsModal open={showUploadChainsModal} onClose={() => setShowUploadChainsModal(false)} />
      )}
      <Container>
        <HeaderBreadcrumbs
          heading="Chains List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Chains', href: PATH_DASHBOARD.general.chains },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => setShowUploadChainsModal(true)}
              startIcon={<Icon icon={plusFill} />}
            >
              Upload Chains
            </Button>
          }
        />
        <Card>
          <Scrollbar>
            <TableContainer component={Paper} sx={{ mt: 5 }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {HEADERS.map((header) => (
                      <TableCell key={header} align={header !== HEADERS[0] ? 'right' : 'left'}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chains.map((data) => (
                    <TableRow key={data.chain} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" padding="none">
                        <Typography variant="subtitle2" noWrap>
                          {data.chain}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{data.count}</TableCell>
                      <TableCell align="right">{data.transferedDataMarts}</TableCell>
                      <TableCell align="right">{formatPercentage(data.percentage)}</TableCell>
                      <TableCell align="right">{formatPercentage(data.transferedDatamartPercentage)}</TableCell>
                      <TableCell align="right">
                        <ChainMoreMenu chain={data.chain} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalChains}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Card>
      </Container>
    </Page>
  );
}
