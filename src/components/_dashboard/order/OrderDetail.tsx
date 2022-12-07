import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// @types
import { ProductState } from '../../../@types/products';
import { Order } from '../../../@types/order';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  deleteCart,
  onNextStep,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Scrollbar from '../../Scrollbar';
import EmptyContent from '../../EmptyContent';
import { CheckoutProductList, CheckoutSummary } from '../area/checkout';

// ----------------------------------------------------------------------

type OrderDetailFormProps = {
  currentOrder?: Order | null;
};

export default function OrderDetail({ currentOrder }: OrderDetailFormProps) {
  const dispatch = useDispatch();
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { cart, total, discount, subtotal } = checkout;
  const isEmptyCart = currentOrder?.orderDetails.length === 0;
  const orderDetail = currentOrder?.orderDetails;
  const handleDeleteCart = (productId: string) => {
    dispatch(deleteCart(productId));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleApplyDiscount = (value: number) => {
    dispatch(applyDiscount(value));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: cart },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        setSubmitting(true);
        handleNextStep();
      } catch (error) {
        console.error(error);
        // setErrors(error.message);
      }
    }
  });

  const { values, handleSubmit } = formik;
  const totalItems = sum(values.products.map((item) => item.quantity));
  const { translate } = useLocales();

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CheckoutSummary
              total={currentOrder?.total}
              enableDiscount
              discount={discount}
              subtotal={subtotal}
              onApplyDiscount={handleApplyDiscount}
              currentOrder={currentOrder}
            />
            {/* <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={values.products.length === 0}
            >
              Check Out
            </Button> */}
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    {translate('model.order.label.totalProduct')}
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      &nbsp;({currentOrder?.orderDetails.length}{' '}
                      {translate('model.order.label.item')})
                    </Typography>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {!isEmptyCart ? (
                <Scrollbar>
                  <CheckoutProductList
                    products={values.products}
                    onDelete={handleDeleteCart}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    orderDetail={orderDetail}
                  />
                </Scrollbar>
              ) : (
                <EmptyContent
                  title="Cart is empty"
                  description="Look like you have no items in your shopping cart."
                  img="/static/illustrations/illustration_empty_cart.svg"
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
