import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageDiver } from '_apis_/diver';

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
  Button,
  Paper
} from '@material-ui/core';
// lang
import useLocales from 'hooks/useLocales';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Diver } from '../../../@types/diver';
//
import { QuillEditor } from '../../editor';
import { UploadAvatar } from '../../upload';
import { Order } from '../../../@types/order';

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
  currentOrder?: Order | null;
};

export default function OrderNewForm({ isEdit, currentOrder }: DiverNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // username: Yup.string().required('Username is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Phone must be only number')
      .min(10, 'Phone must be 10 number')
      .max(10, 'Phone must be 10 number')
      .required('Phone is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    address: Yup.string().required('Address is required')
    // imageUrl: Yup.array().min(1, 'Images is required')
  });

  useEffect(() => {
    setEnumStatus(statusOptions.find((e) => e.id == currentOrder?.status) || null);
  }, [currentOrder]);

  function convertUTCDateToLocalDate(date: any) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentOrder?.id || '',
      name: currentOrder?.name || '',
      createTime: currentOrder?.createTime || '',
      total: currentOrder?.total || 0,
      email: currentOrder?.email || '',
      phone: currentOrder?.phone || '',
      group: currentOrder?.groupId || null,
      mediaUrl: currentOrder?.mediaUrl || '',
      staff: currentOrder?.staffId || 'staff name',
      nationalityName: currentOrder?.nationalityName || '',
      nationalityCode: currentOrder?.nationalityCode || '',
      status: currentOrder?.status || '',
      statusEnum: currentOrder?.statusEnum || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        const bodyFormData = new FormData();
        if (isEdit) {
          bodyFormData.append('id', values.id);
          values.status = enumStatus!.id;
        }
        bodyFormData.append('Name', values.name);
        bodyFormData.append('Phone', values.phone);
        bodyFormData.append('Email', values.email);
        bodyFormData.append('imageFile', imageFILE);

        !isEdit
          ? await manageDiver.createDiver(bodyFormData).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageDiver.updateDiver(bodyFormData).then((response) => {
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
          {/* <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.imageUrl}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.imageUrl && errors.imageUrl)}
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
                  {touched.imageUrl && errors.imageUrl}
                </FormHelperText>
              </Box>
            </Card>
          </Grid> */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Order ID"
                    {...getFieldProps('id')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label="Create Time"
                    {...getFieldProps('createTime')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    disabled={true}
                  />
                </Stack> */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="staff name"
                    {...getFieldProps('staff')}
                    error={Boolean(touched.staff && errors.staff)}
                    helperText={touched.staff && errors.staff}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label="Customer Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    disabled={true}
                  />
                </Stack> */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    disabled={true}
                  />
                </Stack> */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Nationality"
                    {...getFieldProps('nationality')}
                    error={Boolean(touched.nationality && errors.nationality)}
                    helperText={touched.nationality && errors.nationality}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label="Status"
                    {...getFieldProps('statusEnum')}
                    error={Boolean(touched.statusEnum && errors.statusEnum)}
                    helperText={touched.statusEnum && errors.statusEnum}
                    disabled={true}
                  />
                </Stack> */}
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
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )} */}
                {/* <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Diver' : 'Save Changes'}
                  </LoadingButton>
                </Box> */}
              </Stack>
              <Stack>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} alignItems="flex-start">
                    <Typography variant="h5" sx={{ color: 'red' }}>
                      {currentOrder?.status == 0 ? translate('model.order.status.canceled') : ''}
                    </Typography>
                    <Typography>{currentOrder?.note}</Typography>
                    <Typography variant="h5" sx={{ color: 'green' }}>
                      {currentOrder?.status == 1 ? translate('model.order.status.new') : ''}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.orderId')}: {currentOrder?.id}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.customerName')}: {currentOrder?.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.createTime')}:{' '}
                      {convertUTCDateToLocalDate(currentOrder?.createTime)}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.email')}: {currentOrder?.email}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.phone')}: {currentOrder?.phone}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.nationalityName')}:{' '}
                      {currentOrder?.nationalityName}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                      {translate('model.order.label.total')}: {currentOrder?.total}
                    </Typography>
                    {currentOrder?.orderDetails?.map((detail) => (
                      <Paper
                        key={detail?.productId}
                        sx={{
                          p: 3,
                          width: 1,
                          bgcolor: 'background.neutral'
                        }}
                      >
                        <Typography color="green" variant="subtitle1" gutterBottom>
                          {detail?.productName}
                        </Typography>

                        {/* <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            ParticipationAge: &nbsp;
                          </Typography>
                          {detail?.service?.participationAge}
                        </Typography> */}

                        {/* <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            departureTime: &nbsp;
                          </Typography>
                          {detail?.service?.departureTime}
                        </Typography> */}

                        {/* <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            Pickup Point: &nbsp;
                          </Typography>
                          {detail?.service?.pickupPoint}
                        </Typography> */}

                        {/* <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            Duration: &nbsp;
                          </Typography>
                          {detail?.service?.duration}
                        </Typography> */}

                        {/* <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            Description: &nbsp;
                          </Typography>
                          {detail?.description}
                        </Typography> */}

                        <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            {translate('model.order.label.quantity')}: &nbsp;
                          </Typography>
                          {detail?.quantity}
                        </Typography>

                        <Typography variant="body2" gutterBottom>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'text.secondary' }}
                          >
                            {translate('model.order.label.price')}: &nbsp;
                          </Typography>
                          {detail?.price}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
