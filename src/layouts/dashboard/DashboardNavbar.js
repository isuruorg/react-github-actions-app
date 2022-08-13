import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { useLocation } from 'react-router-dom';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@material-ui/core';
// components
//
import AccountPopover from './AccountPopover';
import PolygonMarkerToolBar from '../../pages/polygonMarker/PolygonMarkerToolBar';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme, sidebaropened }) => ({
  boxShadow: 'none',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: sidebaropened === 'closed' ? '100%' : `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func
};

export default function DashboardNavbar({ isOpenSidebar, onOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const isPolygonMarker = pathname.indexOf('/map') === 0;
  return (
    <RootStyle sidebaropened={isOpenSidebar ? 'opened' : 'closed'}>
      <ToolbarStyle>
        <IconButton onClick={isOpenSidebar ? onCloseSidebar : onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
          <Icon icon={menu2Fill} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {isPolygonMarker ? (
          <PolygonMarkerToolBar />
        ) : (
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
            <AccountPopover />
          </Stack>
        )}
      </ToolbarStyle>
    </RootStyle>
  );
}
