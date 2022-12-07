import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// lang
import useLocales from 'hooks/useLocales';

// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import SiteInfoNewForm from 'components/_dashboard/siteInfo/SiteInfoNewForm';
import { manageSiteInfo } from '_apis_/siteInfo';
import useAuth from 'hooks/useAuth';
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
import { SiteInfo } from '../../@types/siteInfo';

// ----------------------------------------------------------------------

export default function SiteInfoDetail() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { translate } = useLocales();
  //   const isEdit = pathname.includes('edit');
  const isEdit = true;
  const { name } = useParams();
  const { user } = useAuth();
  const [currentSiteInfo, setCurrentSiteInfo] = useState<SiteInfo>();

  const reload = () => {
    manageSiteInfo.getSiteInfoByID(paramCase(user?.siteid)).then((response) => {
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
  };

  useEffect(() => {
    if (isEdit) {
      manageSiteInfo.getSiteInfoByID(paramCase(user?.siteid)).then((response) => {
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
    }
  }, [dispatch]);

  return (
    <Page title={translate('model.siteInfo.pageTitle.detailPage')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('model.siteInfo.pageTitle.detailPage')}
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            // { name: 'Site Information', href: PATH_DASHBOARD.siteInfo.root },
            { name: translate('root.siteInfoDetail') }
          ]}
        />
        <SiteInfoNewForm reload={reload} isEdit={isEdit} currentSiteInfo={currentSiteInfo} />
      </Container>
    </Page>
  );
}
