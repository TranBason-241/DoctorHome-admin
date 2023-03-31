/* eslint-disable jsx-a11y/media-has-caption */
import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Box,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  Tab,
  CardMedia
} from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { manageService } from '_apis_/service';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
// utils
import { manageCoral } from '_apis_/coral';
import { manageArea } from '_apis_/area';
import { OptionStatus, statusOptions } from 'utils/constants';
import LivePreview from 'components/upload/LivePreview';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
// import { UserManager, Coral } from '../../../@types/user';

//
// import { QuillEditor } from '../../editor';

// ----------------------------------------------------------------------
import { UploadMultiFile } from '../../upload';
import { Service, ProductType } from '../../../@types/service';
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { Excercise } from '../../../@types/excercise';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  // currentUser?: UserManager;
  currentExcercise?: Excercise;
};

export default function ExcerciseNewForm({ isEdit, currentExcercise }: UserNewFormProps) {
  const [img, setImg] = useState<string[]>();
  const { translate } = useLocales();
  const productTypeList = useSelector((state: RootState) => state.service.productType);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [productTypeSelected, setProductTypeSelected] = useState<ProductType | null>(null);
  const [category, setCategory] = useState<ProductType | any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [hasquantity, setHasQuantity] = useState(false);
  const navigate = useNavigate();
  // const [categoryOption, setCategoryOption] = useState<ProductType[] | any>([]);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('model.Product.validate.name')),
    price: Yup.number()
      .required()
      .min(1, translate('model.Product.validate.price.condition'))
      .required(translate('model.Product.validate.price.required')),
    // quantity: Yup.number()
    //   .required()
    //   .min(1, translate('model.Product.validate.quantity.condition'))
    //   .required(translate('model.Product.validate.quantity.required')),
    description: Yup.string().required(translate('model.Product.validate.description')),
    categoryId: Yup.object().required(translate('model.Product.validate.category')).nullable(true)
  });
  const NewProductSchemaQuantity = Yup.object().shape({
    name: Yup.string().required(translate('model.Product.validate.name')),
    price: Yup.number()
      .required()
      .min(1, translate('model.Product.validate.price.condition'))
      .required(translate('model.Product.validate.price.required')),
    quantity: Yup.number()
      .required()
      .min(1, translate('model.Product.validate.quantity.condition'))
      .required(translate('model.Product.validate.quantity.required')),
    description: Yup.string().required(translate('model.Product.validate.description')),
    categoryId: Yup.object().required(translate('model.Product.validate.category')).nullable(true)
  });
  const { user } = useAuth();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentExcercise?.id || '',
      title: currentExcercise?.title || '',
      description: currentExcercise?.description || '',
      bodyposition: currentExcercise?.bodyposition || '',
      practiceSchedule: currentExcercise?.practiceSchedule || '',
      practicetime: currentExcercise?.practicetime || 0,
      levelexercises: currentExcercise?.levelexercises || '',
      durationvideo: currentExcercise?.durationvideo || '',
      linkvideo: currentExcercise?.linkvideo || ''
      // mediaUrl: currentService?.mediaUrl || '',
      // status: currentService?.status || 0,
      // site: currentService?.site || null,
      // imageUrl: [],
      // images: currentService?.images || [],
    },
    validationSchema: hasquantity ? NewProductSchemaQuantity : NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const flag = false;
      try {
        const bodyFormData = new FormData();
        if (isEdit) {
          // bodyFormData.append('id', values.id);
          // values.status = enumStatus!.id;
          // bodyFormData.append('status', values.status.toString());
        }
        if (!isEdit) {
          // bodyFormData.append('status', '1');
        }
        // if (img) {
        //   img.map((file: any, index) => {
        //     bodyFormData.append(`Images[${index}].Id`, file.id);
        //     bodyFormData.append(`Images[${index}].ImageUrl`, file.imageUrl);
        //   });
        //   img.map((file: any, index) => console.log(`Images[${index}].Id`, file.id));
        // }
        // values.imageUrl.map((file: File | string) => bodyFormData.append('imageFiles', file));
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(
            !isEdit ? translate('snackBar.CreateSuccess') : translate('snackBar.UdpateSuccess'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.service.list);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('snackBar.CreateError') : translate('snackBar.UpdateError'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: {
  //     id: currentService?.id || '',
  //     name: currentService?.name || '',
  //     participationAge: currentService?.participationAge || 0,
  //     departureTime: currentService?.departureTime || 0,
  //     pickupPoint: currentService?.pickupPoint || '',
  //     duration: currentService?.duration || '',
  //     price: currentService?.price || '',
  //     description: currentService?.description || '',
  //     mediaUrl: currentService?.mediaUrl || '',
  //     status: currentService?.status || 1,
  //     site: currentService?.site || null
  //   },
  //   // validationSchema: NewProductSchema,
  //   onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
  //     let flag = false;
  //     try {
  //       // const bodyFormData = new FormData();
  //       // if (isEdit) {
  //       //   bodyFormData.append('id', values.id);
  //       //   values.status = enumStatus!.id;
  //       // }
  //       // bodyFormData.append('name', values.name);
  //       // bodyFormData.append('participationAge', values.participationAge.toString());
  //       // bodyFormData.append('departureTime', values.departureTime.toString());
  //       // bodyFormData.append('pickupPoint', values.pickupPoint);
  //       // bodyFormData.append('duration', values.duration.toString());
  //       // bodyFormData.append('price', values.price.toString());
  //       // bodyFormData.append('description', values.description);
  //       // bodyFormData.append('mediaUrl', '');
  //       // bodyFormData.append('site', values.site);
  //       // console.log(values.site);
  //       !isEdit
  //         ? await manageService.createService(values).then((response) => {
  //             if (response.status == 200) {
  //               flag = true;
  //             }
  //           })
  //         : await manageService.updateService(values).then((response) => {
  //             if (response.status == 200) {
  //               flag = true;
  //             }
  //           });
  //       if (flag) {
  //         resetForm();
  //         setSubmitting(false);
  //         enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
  //           variant: 'success'
  //         });
  //         navigate(PATH_DASHBOARD.service.list);
  //       } else {
  //         enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setSubmitting(false);
  //     }
  //   }
  // });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    handleChange
  } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'imageUrl',
        acceptedFiles.map((file: File | string) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );

  const handleRemoveAll = () => {
    setFieldValue('imageUrl', []);
  };

  const handleRemoveImage = (imageId: string) => {
    if (img) {
      const filteredImage = img.filter((v: any) => v.id !== imageId);
      setImg(filteredImage);
    }
  };

  // const handleRemove = (file: File | string) => {
  //   const filteredItems = values.imageUrl.filter((_file) => _file !== file);
  //   setFieldValue('imageUrl', filteredItems);
  // };

  useEffect(() => {
    // setEnumStatus(statusOptions.find((e) => e.id == currentExcercise?.status) || null);
    // setFieldValue(
    //   'categoryId',
    //   productTypeList.find((e: ProductType) => e.id == currentExcercise?.categoryId)
    // );
    // setImg(currentExcercise?.images);
    console.log(currentExcercise?.linkvideo);
  }, [currentExcercise]);

  const video = `${currentExcercise?.linkvideo?.toString()}`;
  const StyledVideo = styled('video')({
    width: '100%',
    height: 'auto'
  });
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.Product.field.name')}
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  {/* <TextField
                    fullWidth
                    label="ParticipationAge"
                    {...getFieldProps('participationAge')}
                    error={Boolean(touched.participationAge && errors.participationAge)}
                    helperText={touched.participationAge && errors.participationAge}
                    type="number"
                  /> */}
                </Stack>

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="DepartureTime"
                    {...getFieldProps('departureTime')}
                    error={Boolean(touched.departureTime && errors.departureTime)}
                    helperText={touched.departureTime && errors.departureTime}
                    type="number"
                  />
                  <TextField
                    fullWidth
                    label="PickupPoint"
                    {...getFieldProps('pickupPoint')}
                    error={Boolean(touched.pickupPoint && errors.pickupPoint)}
                    helperText={touched.pickupPoint && errors.pickupPoint}
                  />
                </Stack> */}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.Product.field.description')}
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                    multiline
                    rows={2}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Vị trí cơ thể"
                    {...getFieldProps('bodyposition')}
                    error={Boolean(touched.bodyposition && errors.bodyposition)}
                    helperText={touched.bodyposition && errors.bodyposition}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Lịch thực hành"
                    {...getFieldProps('practiceSchedule')}
                    error={Boolean(touched.practiceSchedule && errors.practiceSchedule)}
                    helperText={touched.practiceSchedule && errors.practiceSchedule}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Thời gian thực hành"
                    {...getFieldProps('practicetime')}
                    error={Boolean(touched.practicetime && errors.practicetime)}
                    helperText={touched.practicetime && errors.practicetime}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Cấp độ bài tập"
                    {...getFieldProps('levelexercises')}
                    error={Boolean(touched.levelexercises && errors.levelexercises)}
                    helperText={touched.levelexercises && errors.levelexercises}
                  />
                </Stack>
                <Card sx={{ maxWidth: 700 }}>
                  <StyledVideo
                    src={currentExcercise?.linkvideo.toString()}
                    title="Video Title"
                    controls
                    controlsList="nodownload fullscreen"
                  />
                </Card>
                {/* {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      value={enumStatus}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => option.label}
                      // getOptionLabel={(option: any) => (option ? option.name : '')}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('model.Product.field.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )} */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="categoryId"
                    {...getFieldProps('categoryId')}
                    options={productTypeList}
                    getOptionLabel={(option: any) => option.name}
                    // getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) => {
                      setFieldValue('categoryId', value);
                      setHasQuantity(value.hasQuantity);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('model.Product.field.productType')}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    )}
                  />
                </Stack> */}
                {/* {img && (
                  <>
                    <LivePreview files={img} onRemove={handleRemoveImage} />
                  </>
                )}
                 */}
                {/* <div>
                  <LabelStyle>{translate('model.Product.action.addImage')}</LabelStyle>
                  <UploadMultiFile
                    showPreview
                    accept="image/*"
                    files={values.imageUrl}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                  />
                </div> */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit
                      ? translate('model.Product.action.createProduct')
                      : translate('model.Product.action.save')}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
