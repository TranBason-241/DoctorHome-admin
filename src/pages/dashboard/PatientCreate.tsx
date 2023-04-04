import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { manageDiver } from '_apis_/diver';
import { manageService } from '_apis_/service';
import useLocales from 'hooks/useLocales';
// redux
import { getListProductType } from 'redux/slices/service';
import PatientNewForm from 'components/_dashboard/patient/PatientNewForm';
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
import { Patient } from '../../@types/patient';
import { managePatient } from '../../_apis_/patient';

// ----------------------------------------------------------------------

export default function PatientCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();

  const [currentPatient, setcurrentPatient] = useState<Patient>();

  useEffect(() => {
    if (isEdit) {
      managePatient.getPatientByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          setcurrentPatient(response.data);
        }
      });
    }
  }, [dispatch]);

  return (
    // <Page title={!isEdit ? 'Service: Create a new service' : 'Service: Edit service'}>
    <Page title={!isEdit ? 'Thêm mới bệnh nhân' : 'Cập nhật thông tin bệnh nhân'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới bệnh nhân' : 'Cập nhật thông tin bệnh nhân'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách bệnh nhân', href: PATH_DASHBOARD.service.root },
            { name: !isEdit ? 'Thêm mới bệnh nhân' : name }
          ]}
        />
        {/* <ServiceNewForm1 isEdit={isEdit} currentService={currentService} /> */}
        <PatientNewForm isEdit={isEdit} currentPatient={currentPatient} />
      </Container>
    </Page>
  );
}
