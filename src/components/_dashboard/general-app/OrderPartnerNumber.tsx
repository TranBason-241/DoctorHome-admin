import { Icon } from '@iconify/react';
import { ApexOptions } from 'apexcharts';

import ReactApexChart from 'react-apexcharts';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
// lang
import useLocales from 'hooks/useLocales';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import useAuth from 'hooks/useAuth';
import { Box, Card, Typography, Stack } from '@material-ui/core';
// utils

import { manageOrder } from '_apis_/order';
import { useEffect, useState } from 'react';
import { dispatch } from 'redux/store';
import { fNumber, fPercent } from '../../../utils/formatNumber';
import { Order } from '../../../@types/order';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16)
}));

// ----------------------------------------------------------------------

const PERCENT = 2.6;
const TOTAL_USER = 18765;
const CHART_DATA = [{ data: [2532, 6632, 4132, 8932, 6332, 2532, 4432, 1232, 3632, 932, 3354] }];
type DiverNewFormProps = {
  name: string;
};
export default function OrderPartnerNumber({ name }: DiverNewFormProps) {
  const [orderList, setOrderList] = useState<Order[]>();
  const [totalOrder, setTotalOrder] = useState(0);
  const theme = useTheme();
  const { translate } = useLocales();
  const { user } = useAuth();
  const chartOptions: ApexOptions = {
    colors: [theme.palette.primary.main],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName: number | string) => fNumber(seriesName),

        title: {
          formatter: (seriesName: number | string) => `#${seriesName}`
        }
      },
      marker: { show: false }
    }
  };

  useEffect(() => {
    try {
      manageOrder.getListOrderByPartnerID(name, user?.siteid, -1, 1, '').then((response) => {
        if (response.status == 200) {
          // console.log(response.data.items);
          setOrderList(response.data.items);
          setTotalOrder(response.data.items.length);
          // setTotalOrder(
          //   response.data.items
          //     .map((item: Order) => item.total)
          //     .reduce((prev: any, curr: any) => prev + curr, 0)
          // );
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box>
        <Typography variant="subtitle2">{translate('dashboard.tourists.title')}</Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0, mb: 1 }}>
          {/* <IconWrapperStyle
            sx={{
              ...(PERCENT < 0 && {
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.16)
              })
            }}
          >
            <Icon width={16} height={16} icon={PERCENT >= 0 ? trendingUpFill : trendingDownFill} />
          </IconWrapperStyle> */}
          {/* <Typography component="span" variant="subtitle2">
            {PERCENT > 0 && '+'}
            {fPercent(PERCENT)}
          </Typography> */}
        </Stack>

        <Typography variant="h5">{totalOrder}</Typography>
      </Box>
      {/* 
      <ReactApexChart
        type="bar"
        series={CHART_DATA}
        options={chartOptions}
        width={60}
        height={36}
      /> */}
    </Card>
  );
}
