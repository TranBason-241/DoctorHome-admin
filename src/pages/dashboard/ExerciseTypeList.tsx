// material
import { Button, Container, Grid, Typography } from '@material-ui/core';

// hooks
import { useEffect, useCallback, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import ClassCard from 'components/_dashboard/exercise-type/ExerciseCard';
import { dispatch, RootState } from 'redux/store';
import plusFill from '@iconify/icons-eva/plus-fill';
import { AppWelcome, AppWidgets1 } from '../../components/_dashboard/general-app';
// import { Class } from '../../@types/class';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { ExerciseType } from '../../@types/exerciseType';
import { getListExerciseType } from '../../redux/slices/exerciseType';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function MyClass() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const exerciseTypeList = useSelector((state: RootState) => state.exerciseType.exerciseTypeList);

  useEffect(() => {
    dispatch(getListExerciseType(0));
  }, [dispatch]);

  return (
    <Page title="Lớp của tôi | PJ School">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} sx={{ mb: 3 }} justifyContent="right">
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user?.displayName} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.groupRole.newGroupRole}
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo mới loại bài tập
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {exerciseTypeList?.length > 0 ? (
            <></>
          ) : (
            <>
              {' '}
              <Typography
                variant="subtitle1"
                sx={{
                  pb: { xs: 1, xl: 1 },
                  pt: 10,
                  // maxWidth: 500,
                  mx: 'auto',
                  fontSize: '20px',
                  display: 'block',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                Chúng tôi chưa xác nhận được lớp của bạn
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  pb: { xs: 1, xl: 1 },
                  pt: 1,
                  width: '100%',
                  mx: 'auto',
                  fontSize: '20px',
                  display: 'block',
                  textAlign: 'center'
                }}
              >
                Vui lòng cập nhật lớp học để xem thông tin này.
              </Typography>
            </>
          )}
          {exerciseTypeList?.map((exerciseType: ExerciseType, index: any) => (
            <Grid key={index} item xs={12} md={4}>
              <ClassCard index={index} exerciseType={exerciseType} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
