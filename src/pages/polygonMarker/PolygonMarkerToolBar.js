import { useEffect, useState } from 'react';

import ArticleIcon from '@mui/icons-material/Article';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import HeightIcon from '@mui/icons-material/Height';
import {
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Divider,
  ListItemIcon
} from '@material-ui/core';
import RoomTwoToneIcon from '@mui/icons-material/RoomTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import { useSnackbar } from 'notistack';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { admin } from '../../utils/userRoles';
import axios from '../../utils/axios';
import ChainsModal from './ChainsModal';
import { MButton } from '../../components/@material-extend';
import { getNextStore, getDataEntryCounts } from '../../redux/slices/chain';
import PolygonReporstModal from './PolygonReportsModal';
import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from '../../redux/store';
import SearchStoresModal from './SearchStoresModal';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.caption,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  maxHeight: 50
}));

export default function PolygonMarkerToolBar() {
  const [showChainsModal, setShowChainsModal] = useState(false);
  const [showPolygonReportModal, setShowPolygonReportModal] = useState(false);
  const [showSearchStoreModal, setShowSearchStoresModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { selectedChain, currentStore, skipped, currentFeature, dataEntryCount } = useSelector((state) => state.chain);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getDataEntryCounts());
  }, [dispatch]);

  const isAdmin = user.role === admin;

  const handleSave = async () => {
    try {
      if (currentFeature?.features?.length > 1) {
        enqueueSnackbar('Multiple GeoCodes cannot be saved. Select a single Geo code', {
          variant: 'error'
        });
        return;
      }

      if (currentFeature?.features?.length === 0 && !isAdmin) {
        enqueueSnackbar('Empty GeoCode cannot be saved!', { variant: 'error' });
      }
      const fields = {
        storeId: currentStore._id,
        geoCodeType: 'general',
        geoCode: currentFeature
      };

      const response = await axios.put('/stores/geocodes', fields);
      const { data, error } = response.data;
      if (data) {
        enqueueSnackbar('Saved Successfully', { variant: 'success' });
        dispatch(getNextStore(selectedChain, skipped));
        dispatch(getDataEntryCounts());
      } else {
        enqueueSnackbar(`Failed to save GeoCode - ${error.error}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Failed to save GeoCode - ${error.error}`, { variant: 'error' });
    }
  };

  const unAllocate = async () => {
    try {
      const response = await axios.get('/stores/unallocate');
      const { data, error } = response.data;
      if (data) enqueueSnackbar(`${data} stores un-allocated Successfully`, { variant: 'success' });
      else enqueueSnackbar(`Failed to un-allocate - ${error.error}`, { variant: 'error', autoHideDuration: 10000 });
    } catch (error) {
      enqueueSnackbar(`Failed to un-allocate - ${error.error}`, { variant: 'error', autoHideDuration: 10000 });
    }
  };

  return (
    <>
      {showChainsModal && <ChainsModal open={showChainsModal} onClose={() => setShowChainsModal(false)} />}
      {showPolygonReportModal && (
        <PolygonReporstModal open={showPolygonReportModal} onClose={() => setShowPolygonReportModal(false)} />
      )}
      {showSearchStoreModal && (
        <SearchStoresModal open={showSearchStoreModal} onClose={() => setShowSearchStoresModal(false)} />
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ width: '100%', alignContent: 'center' }}
      >
        <Stack direction="row" spacing={1.5}>
          <Item sx={{ maxHeight: 35 }}>
            <MButton
              color="primary"
              size="medium"
              variant="outlined"
              endIcon={<HeightIcon />}
              onClick={() => setShowChainsModal(true)}
            >
              {selectedChain || 'Select Chain'}
            </MButton>
          </Item>
          {isAdmin && (
            <>
              {selectedChain && (
                <Item sx={{ maxHeight: 35 }}>
                  <MButton
                    color="primary"
                    size="medium"
                    variant="outlined"
                    startIcon={<SearchIcon />}
                    onClick={() => setShowSearchStoresModal(true)}
                  >
                    Search
                  </MButton>
                </Item>
              )}
            </>
          )}

          {currentStore && (
            <Item sx={{ maxHeight: 35 }}>
              <MButton
                color="primary"
                size="medium"
                variant="outlined"
                endIcon={<ChevronRightTwoToneIcon />}
                onClick={() => {
                  dispatch(getNextStore(selectedChain, skipped));
                }}
              >
                Next
              </MButton>
            </Item>
          )}
          {isAdmin && (
            <>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                color="primary"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button'
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setShowPolygonReportModal(true);
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <ArticleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Polygon Reports
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    unAllocate();
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Unallocate All
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          {currentStore && (
            <>
              <Item sx={{ border: '1px solid' }}>
                <Stack direction="row" spacing={2} sx={{ maxWidth: 350 }}>
                  <Tooltip title={`Go to: ${currentStore.address}`}>
                    <IconButton
                      color="primary"
                      size="large"
                      onClick={() =>
                        window.open(`https://www.google.com/maps/search/?api=1&query=${currentStore.address}`, '_blank')
                      }
                    >
                      <RoomTwoToneIcon />
                    </IconButton>
                  </Tooltip>
                  <Divider orientation="vertical" flexItem />
                  <Item sx={{ py: 1 }}>
                    <Tooltip title={currentStore.address}>
                      <Typography
                        variant="caption"
                        component="div"
                        align="center"
                        sx={{
                          maxWidth: 175,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden'
                        }}
                      >
                        {currentStore.address}
                      </Typography>
                    </Tooltip>
                  </Item>
                  <Divider orientation="vertical" flexItem />
                  <Tooltip title="Save">
                    <IconButton color="primary" size="large" onClick={handleSave}>
                      {/* get data entry counts while saving to update latest values */}
                      <SaveTwoToneIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Item>
              <Item sx={{ border: '1px solid', p: 1, maxWidth: 100 }}>
                <Tooltip title={currentStore.store}>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      maxWidth: 100,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}
                  >
                    {currentStore.store}
                  </Typography>
                </Tooltip>
                <Typography variant="caption" gutterBottom component="div">
                  {`Polygons = ${currentFeature?.features?.length || 0}`}
                </Typography>
              </Item>
            </>
          )}
          <Item sx={{ border: '1px solid', p: 1, maxWidth: 100 }}>
            <Typography variant="caption" component="div">
              Today
            </Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                maxWidth: 80,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {`${dataEntryCount || 0} Entrie(s)`}
            </Typography>
          </Item>
        </Stack>
      </Stack>
    </>
  );
}
