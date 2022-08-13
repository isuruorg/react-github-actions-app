import { Container, Grid } from '@material-ui/core';

import {
  AppWelcome,
  AppTotalOrganizations,
  AppTotalChains,
  AppTotalActiveUsers
} from '../../components/_dashboard/general-app';
import Page from '../../components/Page';
import useAuth from '../../hooks/useAuth';
import { admin } from '../../utils/userRoles';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  return (
    <Page title="General: App | Minimal-UI">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user.displayName} />
          </Grid>

          {user.role === admin && (
            <>
              <Grid item xs={12} md={4}>
                <AppTotalActiveUsers />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppTotalChains />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppTotalOrganizations />
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
