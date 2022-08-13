import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Grid, Card, Stack, Switch, TextField, FormControlLabel } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// hooks
import useAuth from '../../../../hooks/useAuth';
//
import { userRoles } from '../../../../utils/userRoles';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '50%',
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.grey[500_32]}`
}));

export default function AccountGeneral() {
  const { user } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user.displayName || '',
      email: user.email,
      active: user.active || true,
      role: userRoles[user.role],
      company: user.company
    }
  });

  const { values, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <RootStyle>
                <img
                  src="/static/avatar.png"
                  alt="TraceClaw"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  sx={{
                    my: 'auto',
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center'
                  }}
                />
              </RootStyle>

              <FormControlLabel
                // disabled
                labelPlacement="start"
                control={
                  <Switch
                    checked={!!values.active}
                    // onChange={(event) => setFieldValue('active', event.target.checked)}
                  />
                }
                label={values.active ? 'Active' : 'Inactive'}
                sx={{ mt: 5 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField disabled fullWidth label="Name" {...getFieldProps('name')} />
                  <TextField disabled fullWidth label="Email Address" {...getFieldProps('email')} />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField disabled fullWidth label="Role" {...getFieldProps('role')} />
                  <TextField
                    fullWidth
                    label="company"
                    placeholder="No Company Selected"
                    {...getFieldProps('company')}
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
