import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { Order } from '../../../../@types/order';

// ----------------------------------------------------------------------

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

type CheckoutSummaryProps = {
  total: any;
  discount?: number;
  subtotal: number;
  shipping?: number;
  onEdit?: VoidFunction;
  enableEdit?: boolean;
  onApplyDiscount?: (discount: number) => void;
  enableDiscount?: boolean;
  currentOrder: Order | any;
};

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  shipping,
  onApplyDiscount,
  enableEdit = false,
  enableDiscount = false,
  currentOrder
}: CheckoutSummaryProps) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  function convertUTCDateToLocalDate(date: any) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }
  const { translate } = useLocales();
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={translate('model.order.label.orderInfomation')}
        action={
          enableEdit && (
            <Button
              size="small"
              type="button"
              onClick={onEdit}
              startIcon={<Icon icon={editFill} />}
            >
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.orderId')}
          </Typography>
          <Typography variant="subtitle2">{currentOrder?.id}</Typography>
        </RowStyle>
        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.createTime')}
          </Typography>
          <Typography variant="subtitle2">
            {convertUTCDateToLocalDate(currentOrder?.createTime)}
          </Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.customerName')}
          </Typography>
          <Typography variant="subtitle2">{currentOrder?.name}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.email')}
          </Typography>
          <Typography variant="subtitle2">{currentOrder?.email}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.phone')}
          </Typography>
          <Typography variant="subtitle2">{currentOrder?.phone}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.nationalityName')}
          </Typography>
          <Typography variant="subtitle2">{currentOrder?.nationalityName}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('model.order.label.status')}
          </Typography>
          <Typography variant="subtitle2">
            {' '}
            {(() => {
              switch (currentOrder?.status) {
                case 1:
                  return translate('Status.new');
                case 0:
                  return translate('Status.cancel');
                case 3:
                  return translate('Status.complete');
                default:
                  return 'null';
              }
            })()}
          </Typography>
        </RowStyle>

        <Divider sx={{ mb: 2 }} />

        <RowStyle>
          <Typography variant="subtitle1"> {translate('model.order.label.total')}</Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
              {/* {fCurrency(total)} */}
              {total?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
            </Typography>
          </Box>
        </RowStyle>
      </CardContent>
    </Card>
  );
}
