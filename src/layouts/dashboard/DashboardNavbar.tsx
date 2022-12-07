import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@material-ui/core';
// hooks
import { useEffect, useState } from 'react';

import { manageSiteInfo } from '_apis_/siteInfo';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { SiteInfo } from '../../@types/siteInfo';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// components
import { MHidden } from '../../components/@material-extend';

import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import ContactsPopover from './ContactsPopover';
import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  },
  backgroundColor: '#beecdb'
}));

// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function DashboardNavbar({ onOpenSidebar }: DashboardNavbarProps) {
  const { isCollapse } = useCollapseDrawer();
  const { translate } = useLocales();
  const { user } = useAuth();
  const [currentSiteInfo, setCurrentSiteInfo] = useState<SiteInfo>();
  useEffect(() => {
    manageSiteInfo.getSiteInfoByID(user?.siteid).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          imageUrl: response.data.imageUrl,
          createTime: response.data.createTime,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          webUrl: response.data.webUrl,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          status: response.data.status,
          listGarden: response.data.listGarden
        };
        setCurrentSiteInfo(data);
      }
    });
  }, []);
  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
        })
      }}
    >
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        {/* <Searchbar /> */}
        <h3 style={{ color: 'black', fontFamily: 'inherit' }}>
          {translate('menu.navbar.siteManager')} : {currentSiteInfo?.name.toLocaleUpperCase()}
        </h3>
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
          {/* <NotificationsPopover /> */}
          {/* <ContactsPopover /> */}
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
