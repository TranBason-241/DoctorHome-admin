import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// lang
import useLocales from 'hooks/useLocales';
// material
import { Container } from '@material-ui/core';
import GroupNewForm from 'components/_dashboard/group/GroupNewForm';
import { manageGroup } from '_apis_/group';
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

import ServiceNewForm1 from '../../components/_dashboard/service/ServiceNewForm1';
import { Service } from '../../@types/service';
import { Group } from '../../@types/group';

// ----------------------------------------------------------------------

export default function GroupCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();

  const [currentGroup, setcurrentGroup] = useState<Group>();
  const { translate } = useLocales();
  useEffect(() => {
    if (isEdit) {
      manageGroup.getGroupByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            startTime: response.data.startTime,
            endTime: response.data.endTime,
            timeTo: response.data.timeTo,
            licenseLate: response.data.licenseLate,
            note: response.data.note,
            siteId: response.data.siteId,
            status: response.data.status
          };
          setcurrentGroup(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title={translate('root.groupDetail')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('root.groupDetail')}
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.group'), href: PATH_DASHBOARD.group.root },
            { name: !isEdit ? translate('root.newGroup') : name }
          ]}
        />

        <GroupNewForm isEdit={isEdit} currentGroup={currentGroup} />
      </Container>
    </Page>
  );
}
