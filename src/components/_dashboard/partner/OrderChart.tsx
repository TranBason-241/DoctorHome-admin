// material
import { Container, Grid } from '@material-ui/core';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers,
  AppTopInstalledCountries
} from '../general-app';
import OrderPartnerChart from '../general-app/OrderPartnerChart';
import OrderPartnerNumber from '../general-app/OrderPartnerNumber';
import OrderPartnerRevenue from '../general-app/OrderPartnerRevenue';

// ----------------------------------------------------------------------
type DiverNewFormProps = {
  name: string;
};
export default function OrderChart({ name }: DiverNewFormProps) {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Dashboard: App | CGMS">
      <Container sx={{ mt: 3 }} maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={12}>
            <AppWelcome displayName={user?.displayName} />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <AppTotalDownloads />
          </Grid> */}
          <Grid item xs={12} md={4}>
            {/* <AppTotalActiveUsers /> */}
            <OrderPartnerNumber name={name} />
          </Grid>

          <Grid item xs={12} md={4}>
            <OrderPartnerRevenue name={name} />
          </Grid>

          {/* <Grid item xs={12} md={3} lg={4}>
            <AppCurrentDownload />
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <OrderPartnerChart name={name} />
          </Grid>

          {/* listGarden */}
          {/* <Grid item xs={12} lg={12}>
            <AppNewInvoice />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AppWidgets1 />
              </Grid>
              <Grid item xs={12}>
                <AppWidgets2 />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
