import { useMemo } from 'react';

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';

// material
import { LoadingButton } from '@material-ui/lab';
import { Autocomplete, Box, Card, Grid, Stack, TextField } from '@material-ui/core';

import { PATH_DASHBOARD } from '../../../routes/paths';
//

import axios from '../../../utils/axios';
import useChains from '../../../hooks/useChains';

// ----------------------------------------------------------------------

CompanyForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCompany: PropTypes.object
};

const optionMapper = (options = []) => options.map((option) => ({ label: option, value: option }));

export default function CompanyForm({ isEdit, currentCompany }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { chainOptions } = useChains();

  const NewCompanySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    chains: Yup.array().required('Chains are required').optional(),
    email: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentCompany?.name || '',
      email: currentCompany?.email || '',
      chains: optionMapper(currentCompany?.accessibleChains) || []
    },
    validationSchema: NewCompanySchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const data = {
          name: values.name,
          accessibleChains: values.chains.map((chain) => chain.value),
          email: values.email
        };

        let response = null;
        if (!isEdit) {
          response = await axios.post('/orgs', data);
        } else {
          data.id = currentCompany._id;
          response = await axios.put('/orgs', data);
        }
        const responseData = response.data.data;
        if (responseData) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
          navigate(PATH_DASHBOARD.general.companies);
        } else {
          const msg = `${isEdit ? 'Update' : 'Create'} failed due to ${response.data.error}`;
          enqueueSnackbar(msg, { variant: 'error' });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(`${error.error}`, { variant: 'error', autoHideDuration: 10000 });
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const remaningChainOptions = useMemo(
    () => chainOptions.filter((chain) => !values.chains.map((chain) => chain.label).includes(chain.value)),
    [values.chains, chainOptions]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    multiple
                    disableClearable
                    value={values.chains}
                    onChange={(event, newValue) => setFieldValue('chains', newValue)}
                    options={remaningChainOptions}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Accessible Chains" />}
                    isClear
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Company' : 'Save Changes'}
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
