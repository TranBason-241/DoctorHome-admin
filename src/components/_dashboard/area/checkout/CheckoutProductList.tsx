import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// utils
import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { CartItem } from '../../../../@types/products';
import { Order, OrderDetails } from '../../../../@types/order';
//
import { MIconButton } from '../../../@material-extend';

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

type IncrementerProps = {
  available: number;
  quantity: number;
  onIncrease: VoidFunction;
  onDecrease: VoidFunction;
};

function Incrementer({ available, quantity, onIncrease, onDecrease }: IncrementerProps) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        {quantity}
        <MIconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
          disabled={quantity >= available}
        >
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
    </Box>
  );
}

type CheckoutProductListProps = {
  products: CartItem[];
  onDelete: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  orderDetail: OrderDetails[] | any;
};

export default function CheckoutProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
  orderDetail
}: CheckoutProductListProps) {
  useEffect(() => {
    console.log(orderDetail);
  });
  const { translate } = useLocales();
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell> {translate('model.Product.field.name')}</TableCell>
            <TableCell align="left">{translate('model.Product.field.price')}</TableCell>
            <TableCell align="left">{translate('model.Product.field.quantity')}</TableCell>
            <TableCell align="right">{translate('model.Product.field.totalPrice')}</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {orderDetail?.map((orderDetail: OrderDetails) => {
            const { id, price, productName, quantity, productId } = orderDetail;
            return (
              <TableRow key={id}>
                {/* <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThumbImgStyle alt="product image" src={cover} />
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                        {name}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            size:&nbsp;
                          </Typography>
                          {price}
                        </Typography>
                        <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            color:&nbsp;
                          </Typography>
                          {getColorName('red')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell> */}

                <TableCell align="left">{productName}</TableCell>
                {/* <TableCell align="left">{fCurrency(price)} VND</TableCell> */}
                <TableCell align="left">
                  {parseInt(price, 10).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </TableCell>

                <TableCell align="left">{quantity}</TableCell>

                <TableCell align="right">
                  {/* {fCurrency(parseInt(price, 10) * parseInt(quantity, 10))} */}
                  {(parseInt(price, 10) * parseInt(quantity, 10)).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </TableCell>

                {/* <TableCell align="right">
                  <MIconButton onClick={() => onDelete(id)}>
                    <Icon icon={trash2Fill} width={20} height={20} />
                  </MIconButton>
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
