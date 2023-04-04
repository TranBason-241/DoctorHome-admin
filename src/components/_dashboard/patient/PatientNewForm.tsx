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
  FormControlLabel
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Diver } from '../../../@types/diver';
//
import { QuillEditor } from '../../editor';
import { UploadAvatar } from '../../upload';
import { Patient } from '../../../@types/patient';

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

type PatientNewFormProps = {
  isEdit: boolean;
  currentPatient?: Patient;
};

export default function PatientNewForm({ isEdit, currentPatient }: PatientNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
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
    setEnumStatus(statusOptions.find((e) => e.id == (currentPatient?.isActive ? 1 : 0)) || null);
  }, [currentPatient]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPatient?.id || '',
      email: currentPatient?.email || '',
      name: currentPatient?.name || '',
      phone: currentPatient?.phone || '',
      backgroundDisease: currentPatient?.backgroundDisease || '',
      allergy: currentPatient?.allergy || '',
      bloodGroup: currentPatient?.bloodGroup || '',
      isActive: currentPatient?.isActive || '',
      avatar: currentPatient?.avatar || null,
      healthChecks: currentPatient?.healthChecks || []
    },
    // validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      //   let flag = false;
      //   try {
      //     const bodyFormData = new FormData();
      //     if (isEdit) {
      //       bodyFormData.append('id', values.id);
      //     }
      //     bodyFormData.append('Name', values.name);
      //     bodyFormData.append('Phone', values.phone);
      //     bodyFormData.append('Email', values.email);
      //     bodyFormData.append('imageFile', imageFILE);
      //     if (!isEdit) {
      //       await manageDiver.createDiver(bodyFormData).then((response) => {
      //         if (response.status == 200) {
      //           flag = true;
      //         }
      //       });
      //     } else {
      //       await manageDiver.updateDiver(bodyFormData).then((response) => {
      //         if (response.status == 200) {
      //           flag = true;
      //         }
      //       });
      //     }
      //     if (flag) {
      //       resetForm();
      //       setSubmitting(false);
      //       enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
      //         variant: 'success'
      //       });
      //       navigate(PATH_DASHBOARD.diver.list);
      //     } else {
      //       enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
      //     }
      //   } catch (error) {
      //     console.error(error);
      //     setSubmitting(false);
      //   }
      alert('Comming soon!!!');
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
                  file={values.avatar}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatar && errors.avatar)}
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
                  {touched.avatar && errors.avatar}
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
                    label="Họ và tên"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="bệnh nền"
                    {...getFieldProps('backgroundDisease')}
                    error={Boolean(touched.backgroundDisease && errors.backgroundDisease)}
                    helperText={touched.backgroundDisease && errors.backgroundDisease}
                  />
                  <TextField
                    fullWidth
                    label="Dị ứng"
                    {...getFieldProps('allergy')}
                    error={Boolean(touched.allergy && errors.allergy)}
                    helperText={touched.allergy && errors.allergy}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Nhóm máu"
                    {...getFieldProps('bloodGroup')}
                    error={Boolean(touched.bloodGroup && errors.bloodGroup)}
                    helperText={touched.bloodGroup && errors.bloodGroup}
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
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Thêm mới' : 'Chỉnh sửa'}
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
