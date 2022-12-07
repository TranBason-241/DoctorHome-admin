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
// lang
import useLocales from 'hooks/useLocales';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { managePartner } from '_apis_/partner';
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Diver } from '../../../@types/diver';
import { Partner } from '../../../@types/partner';
// import { PartnerSite } from '../../../@types/partner';
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
  currentPartnerSite?: Partner;
};

export default function DiverNewForm({ isEdit, currentPartnerSite }: DiverNewFormProps) {
  const navigate = useNavigate();
  const { translate } = useLocales();
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
    setEnumStatus(statusOptions.find((e) => e.id == currentPartnerSite?.status) || null);
  }, [currentPartnerSite]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPartnerSite?.id || '',
      name: currentPartnerSite?.name || '',
      phone: currentPartnerSite?.phone || '',
      email: currentPartnerSite?.email || '',
      address: currentPartnerSite?.address || '',
      webUrl: currentPartnerSite?.webUrl || '',
      partnerType: currentPartnerSite?.partnerType || null,
      status: currentPartnerSite?.status || 0
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

        !isEdit
          ? await manageDiver.createDiver(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await managePartner.updatePartner(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Tạo mới thành công' : 'Cập nhật thành công', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.diver.list);
        } else {
          enqueueSnackbar(!isEdit ? 'Tạo mới thất bại' : 'Cập nhật thất bại', { variant: 'error' });
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
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.Partner.field.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.Partner.field.phone')}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    disabled={true}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.Partner.field.email')}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.Partner.field.address')}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                    disabled={true}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.Partner.field.webUrl')}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={true}
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
                          label={translate('model.Partner.field.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                          disabled={true}
                        />
                      )}
                    />
                  </Stack>
                )}
                {/* <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Diver' : 'Save Changes'}
                  </LoadingButton>
                </Box> */}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
