import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { manageDiver } from '_apis_/diver';
import { manageOrder } from '_apis_/order';
import OrderDetail from 'components/_dashboard/order/OrderDetail';
// lang
import useLocales from 'hooks/useLocales';
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
import OrderNewForm from '../../components/_dashboard/order/OrderNewForm';
import { Service } from '../../@types/service';
import { Order } from '../../@types/order';

// ----------------------------------------------------------------------

export default function OrderCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  // const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('detail');
  const { name } = useParams();

  const [currentOrder, setcurrentOrder] = useState<Order>();

  useEffect(() => {
    if (isEdit) {
      console.log('is edit');
      manageOrder.getOrderByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            createTime: response.data.createTime,
            total: response.data.total,
            email: response.data.email,
            phone: response.data.phone,
            groupId: response.data.group,
            mediaUrl: response.data.mediaUrl,
            staffId: response.data.staff,
            nationalityCode: response.data.nationalityCode,
            nationalityName: response.data.nationalityName,
            status: response.data.status,
            statusEnum: response.data.statusEnum,
            orderDetails: response.data.orderDetails,
            note: response.data.note
          };
          setcurrentOrder(data);
          console.log(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title={!isEdit ? translate('root.orderDetail') : translate('root.orderDetail')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? translate('root.orderDetail') : translate('root.orderDetail')}
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.order'), href: PATH_DASHBOARD.order.root },
            { name: !isEdit ? translate('root.orderDetail') : name }
          ]}
        />

        {/* <OrderNewForm isEdit={isEdit} currentOrder={currentOrder} /> */}
        <OrderDetail currentOrder={currentOrder} />
      </Container>
    </Page>
  );
}
