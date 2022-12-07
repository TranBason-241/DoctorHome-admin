import { Icon } from '@iconify/react';
import ReactApexChart from 'react-apexcharts';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
// lang
import useLocales from 'hooks/useLocales';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Typography, Stack } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
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

const PERCENT = 0.15;
const TOTAL_INSTALLED = 4876;
const CHART_DATA = [{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }];
type DiverNewFormProps = {
  name: string;
};
export default function OrderPartnerRevenue({ name }: DiverNewFormProps) {
  const [orderList, setOrderList] = useState<Order[]>();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const theme = useTheme();
  const { user } = useAuth();
  const { translate } = useLocales();
  const chartOptions = {
    colors: [theme.palette.error.main],
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
          // setTotalOrder(response.data.items.length);
          setTotalRevenue(
            response.data.items
              .map((item: Order) => item.total)
              .reduce((prev: any, curr: any) => prev + curr, 0)
          );
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{translate('dashboard.revenue.title')}</Typography>

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

        <Typography variant="h5">
          {totalRevenue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
        </Typography>
      </Box>

      {/* <ReactApexChart
        type="bar"
        series={CHART_DATA}
        options={chartOptions}
        width={60}
        height={36}
      /> */}
    </Card>
  );
}
