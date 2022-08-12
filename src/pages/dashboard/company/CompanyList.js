import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';

import { MButton } from '../../../components/@material-extend';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getCompanies } from '../../../redux/slices/company';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { UserListToolbar } from '../../../components/_dashboard/user/list';
import TableHeader from '../../../components/_dashboard/table/TableHeader';
import TableRowMoreOptions from '../../../components/_dashboard/table/TableRowMoreOptions';
import { fullFormat } from '../../../utils/time';
import AccessibleChainsModal from './AccessibleChainsModal';
import SearchNotFound from '../../../components/SearchNotFound';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'chains', label: 'Chains', alignRight: false },
  { id: 'lastEdited', label: 'Edited At', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_company) => _company.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CompanyList() {
  const dispatch = useDispatch();
  const [showChainsModal, setShowChainsModal] = useState(false);
  const [currentChains, setCurrentChains] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const { companies = [] } = useSelector((state) => state.company);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = companies.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = companies?.length === 0;

  const filteredCompanies = applySortFilter(companies, getComparator(order, orderBy), filterName);

  const isComanyNotFound = filteredCompanies.length === 0;

  return (
    <Page title="TraceClaw | Company: List">
      <Container>
        <HeaderBreadcrumbs
          heading="Company List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Companies', href: PATH_DASHBOARD.companies.root },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.companies.newCompany}
              startIcon={<Icon icon={plusFill} />}
            >
              New Company
            </Button>
          }
        />

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeader
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={companies.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name, accessibleChains, updatedAt, createdAt } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{accessibleChains?.length || 0}</TableCell>
                        <TableCell align="left">{dayjs(updatedAt).format(fullFormat)}</TableCell>
                        <TableCell align="left">{dayjs(createdAt).format(fullFormat)}</TableCell>
                        <TableCell align="right">
                          <MButton
                            color="success"
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedCompany(name);
                              setCurrentChains(accessibleChains);
                              setShowChainsModal(true);
                            }}
                          >
                            Show Chains
                          </MButton>
                          <TableRowMoreOptions editLink={`${PATH_DASHBOARD.general.companies}/${_id}/${name}/edit`} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan="100%" style={{ textAlign: 'center' }}>
                        <strong>No Companies found.</strong>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {isComanyNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={companies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      {showChainsModal && (
        <AccessibleChainsModal
          open={showChainsModal}
          onClose={() => setShowChainsModal(false)}
          company={selectedCompany}
          chains={currentChains}
        />
      )}
    </Page>
  );
}
