import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import axios from '../../../utils/axios';
import CompanyForm from '../../../components/_dashboard/company/CompanyForm';
// ----------------------------------------------------------------------

export default function CreateCompany() {
  const [currentCompany, setCurrentCompany] = useState();
  const { pathname } = useLocation();
  const { id, name } = useParams();
  const isEdit = pathname.includes('edit');

  const getCompany = async (id) => {
    if (id) {
      axios.get(`/orgs/${id}`).then((response) => {
        const company = response.data.error === null ? response.data.data : null;
        setCurrentCompany(company);
      });
    }
    return null;
  };

  useEffect(() => {
    getCompany(id);
  }, [id]);

  return (
    <Page title="TraceClaw | New Company">
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new company' : 'Edit company'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Companies', href: PATH_DASHBOARD.users.root },
            { name: !isEdit ? 'New Company' : name }
          ]}
        />
        <CompanyForm isEdit={isEdit} currentCompany={currentCompany} />
      </Container>
    </Page>
  );
}
