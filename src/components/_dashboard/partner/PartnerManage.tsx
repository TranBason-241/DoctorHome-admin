import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageDiver } from '_apis_/diver';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton, TabPanel } from '@material-ui/lab';
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
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
// lang
import useLocales from 'hooks/useLocales';
// utils
import PartnerMonthlyReport from 'pages/dashboard/PartnerMonthlyReport';
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
import OrderByPartner from './OrderByPartner';
import OrderChart from './OrderChart';

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
  name: string;
};

export default function PartnerManage({ isEdit, currentPartnerSite, name }: DiverNewFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [optionsPartner, setoptionsPartner] = useState<Partner[] | any>([]);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [valueTab, setValueTab] = useState('General');
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
        await managePartner.createPartner(values.partnerSide.id, user?.id).then((response) => {
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
          navigate(PATH_DASHBOARD.partner.list);
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
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label={translate('model.Partner.tab.orderList')} value="General" />
            <Tab label={translate('model.Partner.tab.orderChart')} value="Chart" />
            <Tab label={translate('model.Partner.tab.monthlyReport')} value="monthlyReport" />
            {/* <Tab label="Item Three" value="3" /> */}
          </TabList>
        </Box>
        <TabPanel value="General">
          <OrderByPartner name={name} />
        </TabPanel>
        <TabPanel value="Chart">
          <OrderChart name={name} />
        </TabPanel>
        <TabPanel value="monthlyReport">
          <PartnerMonthlyReport name={name} />
        </TabPanel>
        {/* <TechInforPassword /> */}
        {/* <TabPanel value="3">Item Three</TabPanel> */}
      </TabContext>
    </Box>
  );
}
