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
// lang
import useLocales from 'hooks/useLocales';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';

import { manageGroupRole } from '_apis_/groupRole';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Diver } from '../../../@types/diver';
import { Group } from '../../../@types/group';
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
  currentGroup?: Group;
};

export default function GroupNewForm({ isEdit, currentGroup }: DiverNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const { translate } = useLocales();
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
  }, [currentGroup]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGroup?.id || '',
      startTime: currentGroup?.startTime || '',
      endTime: currentGroup?.endTime || '',
      timeTo: currentGroup?.timeTo || '',
      licenseLate: currentGroup?.licenseLate || '',
      note: currentGroup?.note || '',
      siteId: currentGroup?.siteId || '',
      status: currentGroup?.status || ''
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
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.group.field.id')}
                    {...getFieldProps('id')}
                    error={Boolean(touched.id && errors.id)}
                    helperText={touched.id && errors.id}
                    disabled={true}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.group.field.startTime')}
                    {...getFieldProps('startTime')}
                    error={Boolean(touched.startTime && errors.startTime)}
                    helperText={touched.startTime && errors.startTime}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.group.field.endTime')}
                    {...getFieldProps('endTime')}
                    error={Boolean(touched.endTime && errors.endTime)}
                    helperText={touched.endTime && errors.endTime}
                    disabled={true}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.group.field.timeTo')}
                    {...getFieldProps('timeTo')}
                    error={Boolean(touched.timeTo && errors.timeTo)}
                    helperText={touched.timeTo && errors.timeTo}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label={translate('model.group.field.licenseLate')}
                    {...getFieldProps('licenseLate')}
                    error={Boolean(touched.licenseLate && errors.licenseLate)}
                    helperText={touched.licenseLate && errors.licenseLate}
                    disabled={true}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('model.group.field.note')}
                    {...getFieldProps('note')}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
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
                          label={translate('model.group.field.status')}
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
                    {!isEdit ? 'Create Group Role' : 'Save Changes'}
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
