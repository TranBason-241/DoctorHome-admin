import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api

import { manageCoral } from '_apis_/coral';
// material
import PartnerAddNew from 'components/_dashboard/partner/PartnerAddNew';
import PartnerManage from 'components/_dashboard/partner/PartnerManage';
import { Container } from '@material-ui/core';

// lang
import useLocales from 'hooks/useLocales';
// redux
import { managePartner } from '_apis_/partner';
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import PartnerNewForm from '../../components/_dashboard/partner/PartnerNewForm';
import { Partner } from '../../@types/partner';

// ----------------------------------------------------------------------

export default function ServiceCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const isManage = pathname.includes('manageOrderPartner');
  const isAddNew = pathname.includes('new');
  const { name } = useParams();
  // const currentDiver = diverList.find((diver) => paramCase(diver.name) === name);
  const [currentPartnerSite, setcurrentPartnerSite] = useState<Partner>();
  let heading = '';
  let link = '';
  if (isEdit) {
    heading = `${translate('root.Edit')}: `;
  } else if (isManage) {
    heading = '';
  } else if (isAddNew) {
    heading = translate('root.addNew');
  }

  if (isEdit) {
    link = translate('root.Edit');
  } else if (isManage) {
    link = translate('root.manageOrder');
  } else if (isAddNew) {
    link = translate('root.addNew');
  }
  useEffect(() => {
    if (isEdit) {
      managePartner.getPartnerByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          const data = {
            id: response.dataid,
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
            address: response.data.address,
            webUrl: response.data.webUrl,
            partnerType: response.data.partnerType,
            status: response.data.status
          };
          setcurrentPartnerSite(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title={!isEdit ? translate('root.newPartner') : translate('root.editPartner')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          // heading={!isEdit ? translate('root.newPartner') : translate('root.editPartner')}
          heading=""
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.partner'), href: PATH_DASHBOARD.partner.root },
            { name: link }
          ]}
        />

        {/* {!isEdit ? (
          <PartnerAddNew isEdit={isEdit} currentPartnerSite={currentPartnerSite} />
        ) : (
          <PartnerNewForm isEdit={isEdit} currentPartnerSite={currentPartnerSite} />
        )} */}

        {isEdit ? (
          <PartnerNewForm isEdit={isEdit} currentPartnerSite={currentPartnerSite} />
        ) : (
          <></>
        )}

        {isAddNew ? (
          <PartnerAddNew isEdit={isEdit} currentPartnerSite={currentPartnerSite} />
        ) : (
          <></>
        )}
        {isManage ? (
          <PartnerManage name={name} isEdit={isEdit} currentPartnerSite={currentPartnerSite} />
        ) : (
          <></>
        )}
      </Container>
    </Page>
  );
}
