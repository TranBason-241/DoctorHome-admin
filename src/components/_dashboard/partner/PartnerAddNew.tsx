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
import useAuth from '../../../hooks/useAuth';
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

// const PartnerOptions = status.map((v, index) => ({
//   id: index,
//   label: v
// }));
// ----------------------------------------------------------------------

type DiverNewFormProps = {
  isEdit: boolean;
  currentPartnerSite?: Partner;
};

export default function PartnerAddNew({ isEdit, currentPartnerSite }: DiverNewFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [optionsPartner, setoptionsPartner] = useState<Partner[] | any>([]);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    partnerSide: Yup.object()
      .required(translate('model.Partner.validate.partnerSide'))
      .nullable(true)
    // imageUrl: Yup.array().min(1, 'Images is required')
  });

  useEffect(() => {
    managePartner.getPartnerOutSide(user?.siteid).then((response) => {
      if (response.status == 200) {
        setoptionsPartner(response.data.items);
      } else {
        setoptionsPartner([]);
      }
    });
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      partnerSide: currentPartnerSite?.id || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      // console.log(optionsPartner[0]?.id);
      setSubmitting(false);
      let flag = false;
      console.log(values.partnerSide.id);
      try {
        await managePartner.createPartner(values.partnerSide.id, user?.siteid).then((response) => {
          if (response.status == 200) {
            flag = true;
          }
        });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'THêm mới thành công' : 'Cập nhật thành công', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.partner.list);
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
        <Grid container spacing={8}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 8 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {translate('model.Partner.action.select')}
                </Typography>
              </Stack>
              <Stack spacing={20}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  clearIcon
                  id="partnerSide"
                  {...getFieldProps('partnerSide')}
                  options={optionsPartner}
                  getOptionLabel={(option: any) => (option ? option.name : '')}
                  onChange={(e, value: any) =>
                    value ? { ...setFieldValue('partnerSide', value) } : ''
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={translate('model.Partner.label.partner')}
                      error={Boolean(touched.partnerSide && errors.partnerSide)}
                      helperText={touched.partnerSide && errors.partnerSide}
                    />
                  )}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit
                      ? translate('model.Partner.action.addToSite')
                      : translate('model.Partner.action.save')}
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
