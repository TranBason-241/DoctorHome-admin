/* eslint-disable no-const-assign */
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
  Tab
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
import { manageExerciseType } from '_apis_/exerciseType';
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
import CoralDetailsCarousel from '../coral/CoralDetailsCarousel';
import CoralDetailsSummary from '../coral/CoralDetailsSummary';
import { Service, ProductType } from '../../../@types/service';
import { ExerciseType } from '../../../@types/exerciseType';
// import ServiceDetailsCarousel from '.././list/ServiceDetailsCarousel';
import { RootState, useDispatch, useSelector } from '../../../redux/store';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  // currentUser?: UserManager;
  currentExcerciseType?: ExerciseType;
};
export default function ExcersiceNewForm({ isEdit, currentExcerciseType }: UserNewFormProps) {
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
      id: currentExcerciseType?.id || '',
      title: currentExcerciseType?.title || '',
      description: currentExcerciseType?.description || ''
    },
    validationSchema: hasquantity ? NewProductSchemaQuantity : NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        const bodyFormData = new FormData();
        bodyFormData.append('title', values.title.toString());
        bodyFormData.append('Description', values.description.toString());
        if (!isEdit) {
          await manageExerciseType.updateExerciseType(values).then((response) => {
            if (response.status == 200) {
              flag = true;
            }
          });
        } else {
          await manageExerciseType.updateExerciseType(values).then((response) => {
            if (response.status == 200) {
              flag = true;
            }
          });
        }
        console.log(values);
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
                    label="Tên loại bài tập"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.Product.field.description')}
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>

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
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Tạo mới' : 'Cập nhật'}
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
