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

// ----------------------------------------------------------------------

export default function ExerciseTypeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();

  const [currentService, setcurrentService] = useState<Service>();

  useEffect(() => {
    dispatch(getListProductType());
    if (isEdit) {
      manageService.getServiceByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          // console.log(response.data);
          const data = {
            id: response.data.id,
            name: response.data.name,
            // participationAge: response.data.participationAge,
            // departureTime: response.data.departureTime,
            // pickupPoint: response.data.pickupPoint,
            // duration: response.data.duration,
            categoryId: response.data.categoryId,
            categoryName: response.data.categoryName,
            price: response.data.price,
            description: response.data.description,
            mediaUrl: response.data.mediaUrl,
            status: response.data.status,
            site: response.data.site,
            images: response.data.images,
            imageUrl: [],
            quantity: response.data.quantity
          };
          // console.log(data);
          setcurrentService(data);
        }
      });
    }
  }, [dispatch]);

  return (
    // <Page title={!isEdit ? 'Service: Create a new service' : 'Service: Edit service'}>
    <Page title={!isEdit ? 'Tạo mới sản phẩm' : 'Chỉnh sửa sản phẩm'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('model.Product.pageTitle.createPage')
              : translate('model.Product.pageTitle.editPage')
          }
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.service.root },
            { name: !isEdit ? translate('root.newProduct') : name }
          ]}
        />
        <ServiceNewForm1 isEdit={isEdit} currentService={currentService} />
      </Container>
    </Page>
  );
}
