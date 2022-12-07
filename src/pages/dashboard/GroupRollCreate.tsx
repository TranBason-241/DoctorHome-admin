import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';

import { manageGroupRole } from '_apis_/groupRole';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ServiceNewForm from '../../components/_dashboard/service/ServiceNewForm';
import GroupRoleNewForm from '../../components/_dashboard/groupRole/GroupRoleNewForm';
import ServiceNewForm1 from '../../components/_dashboard/service/ServiceNewForm1';
import { Service } from '../../@types/service';
import { GroupRole } from '../../@types/groupRole';

// ----------------------------------------------------------------------

export default function ServiceCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();

  const [currentGroupRole, setcurrentGroupRole] = useState<GroupRole>();

  useEffect(() => {
    if (isEdit) {
      manageGroupRole.getGroupRoleByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            personalRate: response.data.personalRate,
            partnerRate: response.data.partnerRate
          };
          setcurrentGroupRole(data);
          console.log(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title={!isEdit ? 'Group role: Create a group role' : 'Group role: Edit group role'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new group role' : 'Edit group role'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Group role', href: PATH_DASHBOARD.groupRole.root },
            { name: !isEdit ? 'New group role' : name }
          ]}
        />

        <GroupRoleNewForm isEdit={isEdit} currentGroupRole={currentGroupRole} />
      </Container>
    </Page>
  );
}
