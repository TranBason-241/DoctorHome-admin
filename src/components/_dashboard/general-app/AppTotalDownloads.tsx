import { Icon } from '@iconify/react';
import ReactApexChart from 'react-apexcharts';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
// material
// lang
import useLocales from 'hooks/useLocales';
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Typography, Stack } from '@material-ui/core';
// utils
import { fNumber, fPercent } from '../../../utils/formatNumber';

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

const PERCENT = -0.06;
const TOTAL_DOWNLOAD = 3;
const CHART_DATA = [{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }];

export default function AppTotalDownloads() {
  const theme = useTheme();
  const { translate } = useLocales();
  const chartOptions = {
    colors: [theme.palette.info.main],
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

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{translate('dashboard.garden.title')}</Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
          {/* <Typography component="span" variant="subtitle2">
            {PERCENT > 0 && '+'}
            {fPercent(PERCENT)}
          </Typography> */}
        </Stack>

        <Typography variant="h3">3</Typography>
      </Box>

      <ReactApexChart
        type="bar"
        series={CHART_DATA}
        options={chartOptions}
        width={60}
        height={36}
      />
    </Card>
  );
}
