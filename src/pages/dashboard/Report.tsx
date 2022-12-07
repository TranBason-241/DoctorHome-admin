import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik, yupToFormErrors } from 'formik';
import { manageDiver } from '_apis_/diver';
// lang
import useLocales from 'hooks/useLocales';

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
  Tabs,
  Tab
} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';

import { manageGroupRole } from '_apis_/groupRole';
import SiteReport from './SiteReport';
// routes
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types

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

type TechInfoNewFormProps = {
  isEdit: boolean;
  reload: any;
};

export default function TechInfoNewForm({ isEdit, reload }: TechInfoNewFormProps) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const [valueTab, setValueTab] = useState('Sale');
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label={translate('model.report.tab.saleReport')} value="Sale" />
            {/* <Tab label="PARTNER REPORT" value="Partner" /> */}
          </TabList>
        </Box>
        <TabPanel value="Sale">
          <SiteReport />
        </TabPanel>
        {/* <TabPanel value="Partner">
          <h2>Partner report</h2>
        </TabPanel> */}

        {/* <TabPanel value="3">Item Three</TabPanel> */}
      </TabContext>
    </Box>
  );
}
