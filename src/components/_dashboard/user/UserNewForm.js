import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { experimentalStyled as styled } from '@material-ui/core/styles';

// material
import { LoadingButton } from '@material-ui/lab';
import {
  Autocomplete,
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormControlLabel
} from '@material-ui/core';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { useDispatch, useSelector } from '../../../redux/store';
import { getCompanies } from '../../../redux/slices/company';
import { userRoleOptions, dataEntry } from '../../../utils/userRoles';
import axios from '../../../utils/axios';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '50%',
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.grey[500_32]}`
}));

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { companies = [] } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  const companyOptions = useMemo(
    () => companies.map((company) => ({ label: company.name, id: company._id })),
    [companies]
  );

  const NewUserSchema = Yup.object().shape(
    {
      name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required').email(),
      phone: Yup.string().nullable().notRequired(),
      company: Yup.object().nullable().notRequired(),
      role: Yup.object().required('Role is required'),
      active: Yup.boolean().required('Active status required')
    },
    ['phone', 'company']
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone,
      active: isEdit ? currentUser?.active : true,
      company: currentUser?.organization
        ? companyOptions.find((option) => option.id === currentUser.organization._id)
        : null,
      role:
        isEdit && currentUser?.role
          ? userRoleOptions.find((option) => option.value === currentUser.role)
          : userRoleOptions.find((option) => option.value === dataEntry)
    },
    validationSchema: NewUserSchema,
    // validator: () => ({}),
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const data = {
          id: currentUser?._id,
          email: values.email,
          name: values.name,
          phone: values.phone,
          active: values.active,
          organization: values.company?.id,
          role: values.role.value
        };
        let response = null;
        if (!isEdit) {
          delete data.id;
          data.password = '123@traceclaw';
          response = await axios.post('/users', data);
        } else {
          delete data.email;
          response = await axios.put('/users', data);
        }
        const responseData = response.data.data;
        if (responseData) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
          navigate(PATH_DASHBOARD.general.users);
        } else {
          const msg = `${isEdit ? 'Update' : 'Create'} failed due to ${response.data.error}`;
          enqueueSnackbar(msg, { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(`${error.error}`, { variant: 'error', autoHideDuration: 10000 });
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
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
              </Box>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={!!values.active}
                    onChange={(event) => setFieldValue('active', event.target.checked)}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Active
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />

              <FormControlLabel
                disabled
                labelPlacement="start"
                control={<Switch {...getFieldProps('active')} checked={false} />}
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helpertext={touched.name && errors.name}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    disabled={isEdit}
                    fullWidth
                    label="Email (Username)"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helpertext={touched.email && errors.email}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helpertext={touched.phone && errors.phone}
                  />
                  <Autocomplete
                    value={values.role}
                    onChange={(event, newValue) => {
                      setFieldValue('role', newValue);
                    }}
                    options={userRoleOptions}
                    sx={{ width: '75%' }}
                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField {...params} label="Role" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    value={values.company}
                    onChange={(event, newValue) => {
                      setFieldValue('company', newValue);
                    }}
                    options={companyOptions}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Company" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create User' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
