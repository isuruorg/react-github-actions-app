import { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const [currentUser, setCurrentUser] = useState();
  const { pathname } = useLocation();
  const { id, name } = useParams();
  // const { userList } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  // const currentUser = userList.find((user) => paramCase(user.name) === name);

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(`/users/${id}`);
      const { data } = response.data;
      if (data) {
        setCurrentUser(data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      setCurrentUser(null);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) getUser();
  }, [getUser, isEdit]);

  return (
    <Page title="TraceClaw">
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.general.users },
            { name: !isEdit ? 'New user' : name }
          ]}
        />
        <UserNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
