import { Icon } from '@iconify/react';
import ReactApexChart from 'react-apexcharts';
import { Link as RouterLink } from 'react-router-dom';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
import { PATH_AUTH, PATH_DASHBOARD } from 'routes/paths';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Typography, Stack, Button, Grid } from '@material-ui/core';
// utils
import { fNumber, fPercent } from '../../../utils/formatNumber';
import { ExerciseType } from '../../../@types/exerciseType';

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

type classCardProps = {
  exerciseType: ExerciseType | any;
  index: number;
};

export default function ClassCard({ exerciseType, index }: classCardProps) {
  const theme = useTheme();
  const bgColor = ['rgba(225,239,240,255)', 'rgba(255,237,188,255)', '#FFCCCC'];

  return (
    <Card
      sx={{
        display: 'flex',
        // alignItems: 'center',
        p: 2,
        // backgroundColor: bgColor[index],
        backgroundColor: 'rgba(225, 239, 240, 255)',
        height: 'auto'
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h3">{exerciseType?.title}</Typography>

        <Stack direction="row" alignItems="" spacing={0} sx={{ mt: 2, mb: 0 }}>
          <Typography component="span" variant="subtitle2">
            {exerciseType?.description}
          </Typography>
        </Stack>
        <Stack>
          <Grid container justifyContent="right">
            <Grid item sx={{ mt: 4, mb: 1 }} spacing={1}>
              <Button
                variant="contained"
                to={`${PATH_DASHBOARD.root}/${exerciseType?.id}`}
                component={RouterLink}
              >
                {/* Xem tất cả bài tập {exerciseType?.description} */}
                Xem tất cả
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Card>
  );
}
