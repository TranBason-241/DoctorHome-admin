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
import ExcerciseNewForm from 'components/_dashboard/excercise/ExcerciseNewForm';
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
import { manageExcercise } from '../../_apis_/excercise';
import { Excercise } from '../../@types/excercise';

// ----------------------------------------------------------------------

export default function ExerciseTypeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();

  const [currentExcercise, setcurrentExcercise] = useState<Excercise>();

  useEffect(() => {
    if (isEdit) {
      manageExcercise.getExcerciseID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          // console.log(response.data);
          const data = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            thumbnail: response.data.thumbnail,
            linkvideo: response.data.linkvideo,
            bodyposition: response.data.bodyposition,
            practiceSchedule: response.data.practiceSchedule,
            practicetime: response.datapracticetime,
            levelexercises: response.data.levelexercises,
            durationvideo: response.data.durationvideo
          };
          // console.log(data);
          setcurrentExcercise(data);
        }
      });
    }
  }, [dispatch]);

  return (
    // <Page title={!isEdit ? 'Service: Create a new service' : 'Service: Edit service'}>
    <Page title={!isEdit ? 'Tạo mới bài tập' : 'Chỉnh sửa bài tập'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo mới bài tập' : 'Chỉnh sửa bài tập'}
          links={[
            { name: 'Bản điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách loại bài tập', href: PATH_DASHBOARD.exerciseType.root },
            { name: !isEdit ? 'Tạo mới loại bài tập' : name }
          ]}
        />
        <ExcerciseNewForm isEdit={isEdit} currentExcercise={currentExcercise} />
      </Container>
    </Page>
  );
}
