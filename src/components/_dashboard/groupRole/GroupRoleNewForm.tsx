import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik, yupToFormErrors } from 'formik';
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

import { manageGroupRole } from '_apis_/groupRole';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Diver } from '../../../@types/diver';
import { GroupRole } from '../../../@types/groupRole';
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
  currentGroupRole?: GroupRole;
};

export default function GroupRoleNewForm({ isEdit, currentGroupRole }: DiverNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // personalRate: Yup.number().required('personalRate is required'),
    // partnerRate: Yup.number().required('NapartnerRateme is required')

    partnerRate: Yup.number()
      .required()
      .min(0, 'Min is 1')
      .max(100, 'max is 100')
      .required('partnerRate is required'),

    personalRate: Yup.number()
      .required()
      .min(0, 'Min is 1')
      .max(100, 'max is 100')
      .required('personalRate is required')
  });

  useEffect(() => {
    // setEnumStatus(statusOptions.find((e) => e.id == currentGiverroupRole?.status) || null);
  }, [currentGroupRole]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGroupRole?.id || '',
      name: currentGroupRole?.name || '',
      personalRate: currentGroupRole?.personalRate || 0,
      partnerRate: currentGroupRole?.partnerRate || 0
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
        // bodyFormData.append('Name', values.name);
        // bodyFormData.append('Phone', values.phone);
        // bodyFormData.append('Email', values.email);
        // bodyFormData.append('Address', values.address);
        // bodyFormData.append('Status', values.status);
        // bodyFormData.append('imageFile', imageFILE);

        !isEdit
          ? await manageGroupRole.createGroupRole(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageGroupRole.updateGroupRole(values).then((response) => {
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
          navigate(PATH_DASHBOARD.groupRole.list);
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="PersonalRate"
                    {...getFieldProps('personalRate')}
                    error={Boolean(touched.personalRate && errors.personalRate)}
                    helperText={touched.personalRate && errors.personalRate}
                    type="number"
                  />
                  <TextField
                    fullWidth
                    label="PartnerRate"
                    {...getFieldProps('partnerRate')}
                    error={Boolean(touched.partnerRate && errors.partnerRate)}
                    helperText={touched.partnerRate && errors.partnerRate}
                    type="number"
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
                    {!isEdit ? 'Create Group Role' : 'Save Changes'}
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
