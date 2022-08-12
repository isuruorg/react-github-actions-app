import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

import { useRef, useState } from 'react';
import downloadfill from '@iconify/icons-eva/download-fill';
import homeFill from '@iconify/icons-eva/home-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// routes
import axios from '../../../utils/axios';
import useDownload from '../../../hooks/useDownload';
// ----------------------------------------------------------------------

ChainMoreMenu.propTypes = {
  chain: PropTypes.string
};

export default function ChainMoreMenu({ chain }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const download = useDownload();
  const { enqueueSnackbar } = useSnackbar();

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
      } else {
        enqueueSnackbar('Failed to download marked JSON', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Failed to download marked JSON: ${error?.error}`, { variant: 'error', autoHideDuration: 5000 });
    }
  };
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled onClick={() => {}} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={homeFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Stores" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={() => downloadMarkedData(chain)} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={downloadfill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Download" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem disabled onClick={() => {}} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {/* <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.users.root}/${userId}/${userName}/edit`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
      </Menu>
    </>
  );
}
