import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageService } from '_apis_/service';
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
  FormControlLabel
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Service } from '../../../@types/service';
//
import { QuillEditor } from '../../editor';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// type OptionStatus = {
//   id: number;
//   label: string;
// };

// const status = ['Deleted', 'Available'];

// const statusOptions = status.map((v, index) => ({
//   id: index,
//   label: v
// }));
// ----------------------------------------------------------------------

type DiverNewFormProps = {
  isEdit: boolean;
  currentService?: Service;
};

export default function DiverNewForm({ isEdit, currentService }: DiverNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // // username: Yup.string().required('Username is required'),
    participationAge: Yup.string()
      .required()
      .min(1, 'More than 1')
      .max(100, 'less than 100')
      .required('Participation age is required'),
    departureTime: Yup.string()
      .required()
      .min(1, 'More than 1')
      .max(100, 'less than 100')
      .required('departureTime is required'),
    pickupPoint: Yup.string().required('PickupPoint is required'),
    duration: Yup.string()
      .required()
      .min(1, 'More than 1')
      .max(100, 'less than 100')
      .required('Duration age is required'),
    price: Yup.string()
      .required()
      .min(1, 'More than 1')
      .max(100, 'less than 100')
      .required('Price age is required'),
    description: Yup.string().required('Description is required')
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // address: Yup.string().required('Address is required')
    // // imageUrl: Yup.array().min(1, 'Images is required')
  });

  useEffect(() => {
    setEnumStatus(statusOptions.find((e) => e.id == currentService?.status) || null);
  }, [currentService]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentService?.id || '',
      name: currentService?.name || '',
      categoryId: currentService?.categoryId || '',
      // participationAge: currentService?.participationAge || 0,
      // departureTime: currentService?.departureTime || 0,
      // pickupPoint: currentService?.pickupPoint || '',
      // duration: currentService?.duration || '',
      price: currentService?.price || '',
      description: currentService?.description || '',
      mediaUrl: currentService?.mediaUrl || '',
      status: currentService?.status || 1,
      site: currentService?.site || null
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        // const bodyFormData = new FormData();
        // if (isEdit) {
        //   bodyFormData.append('id', values.id);
        //   values.status = enumStatus!.id;
        // }
        // bodyFormData.append('name', values.name);
        // bodyFormData.append('participationAge', values.participationAge.toString());
        // bodyFormData.append('departureTime', values.departureTime.toString());
        // bodyFormData.append('pickupPoint', values.pickupPoint);
        // bodyFormData.append('duration', values.duration.toString());
        // bodyFormData.append('price', values.price.toString());
        // bodyFormData.append('description', values.description);
        // bodyFormData.append('mediaUrl', '');
        // bodyFormData.append('site', values.site);
        // console.log(values.site);
        !isEdit
          ? await manageService.createService(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageService.updateService(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.diver.list);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageFILE(file);
      if (file) {
        setFieldValue('imageUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.mediaUrl}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.mediaUrl && errors.mediaUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.mediaUrl && errors.mediaUrl}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
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
                  {/* <TextField
                    fullWidth
                    label="Duration"
                    {...getFieldProps('duration')}
                    error={Boolean(touched.duration && errors.duration)}
                    helperText={touched.duration && errors.duration}
                  /> */}
                  <TextField
                    fullWidth
                    label="Price"
                    {...getFieldProps('price')}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>

                {isEdit && (
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
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Diver' : 'Save Changes'}
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
