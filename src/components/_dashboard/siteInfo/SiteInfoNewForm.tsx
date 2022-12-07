import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik, yupToFormErrors } from 'formik';
import { manageDiver } from '_apis_/diver';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
// lang
import useLocales from 'hooks/useLocales';
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

import { manageGroupRole } from '_apis_/groupRole';
import { manageSiteInfo } from '_apis_/siteInfo';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Diver } from '../../../@types/diver';
import { GroupRole } from '../../../@types/groupRole';
import { SiteInfo } from '../../../@types/siteInfo';
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
  currentSiteInfo?: SiteInfo;
  reload: any;
};

export default function SiteInfoNewForm({ reload, isEdit, currentSiteInfo }: DiverNewFormProps) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Phone must be only number')
      .min(10, 'Phone must be 10 number')
      .max(10, 'Phone must be 10 number')
      .required('Phone is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    address: Yup.string().required('Address is required'),
    webUrl: Yup.string().required('Web is required')
  });

  useEffect(() => {
    // setEnumStatus(statusOptions.find((e) => e.id == currentGroupRole?.status) || null);
  }, [currentSiteInfo]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentSiteInfo?.id || '',
      name: currentSiteInfo?.name || '',
      imageUrl: currentSiteInfo?.imageUrl || '',
      createTime: currentSiteInfo?.createTime || '',
      phone: currentSiteInfo?.phone || '',
      email: currentSiteInfo?.email || '',
      address: currentSiteInfo?.address || '',
      webUrl: currentSiteInfo?.webUrl || '',
      latitude: currentSiteInfo?.latitude || '',
      longitude: currentSiteInfo?.longitude || '',
      status: currentSiteInfo?.status || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(0);
      let flag = false;
      try {
        const bodyFormData = new FormData();
        bodyFormData.append('id', values.id);
        bodyFormData.append('Name', values.name);
        bodyFormData.append('Phone', values.phone);
        bodyFormData.append('Email', values.email);
        bodyFormData.append('Address', values.address);
        bodyFormData.append('WebUrl', values.webUrl);
        bodyFormData.append('Latitude', values.latitude);
        bodyFormData.append('Longitude', values.longitude);
        bodyFormData.append('status', values.status);
        bodyFormData.append('imageUrl', values.imageUrl);
        bodyFormData.append('imageFile', imageFILE);

        await manageSiteInfo.updateSiteInfo(bodyFormData).then((response) => {
          if (response.status == 200) {
            flag = true;
            reload();
            // navigate(PATH_DASHBOARD.root);
          }
        });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
            variant: 'success'
          });
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
                      {translate('model.siteInfo.label.allowed')} *.jpeg, *.jpg, *.png, *.gif
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.imageUrl && errors.imageUrl}
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
                    label={translate('model.siteInfo.label.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.createTime')}
                    {...getFieldProps('createTime')}
                    error={Boolean(touched.createTime && errors.createTime)}
                    helperText={touched.createTime && errors.createTime}
                    disabled={true}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.phone')}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.email')}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={true}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.address')}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.webUrl')}
                    {...getFieldProps('webUrl')}
                    error={Boolean(touched.webUrl && errors.webUrl)}
                    helperText={touched.webUrl && errors.webUrl}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.latitude')}
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.siteInfo.label.longitude')}
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                    disabled={true}
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
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )} */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {translate('model.siteInfo.action.save')}
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
