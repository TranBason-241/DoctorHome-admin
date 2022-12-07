import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Card,
  Stack,
  Typography,
  Autocomplete,
  Box
} from '@material-ui/core';
// lang
import useLocales from 'hooks/useLocales';
import { Form, FormikProvider, useFormik } from 'formik';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

type OrderMoreMenuProps = {
  // onCancel(id: string, note: string): Function;
  onCancelOrder: any;
  orderID: string;
};

export default function OrderMoreMenu({ onCancelOrder, orderID }: OrderMoreMenuProps) {
  const ref = useRef(null);
  const { translate } = useLocales();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [getReason, setReason] = useState('');
  const [reasonCombobox, setReasonCombobox] = useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const reasonList = ['Bad weather', 'Order is refused', 'Other reason'];

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  const onChangeReason = (e: any) => {
    console.log(e.target.value);
    setReason(e.target.value);
  };

  const NewProductSchema = Yup.object().shape({
    partnerSide: Yup.string().required(translate('model.Partner.validate.partnerSide'))
    // imageUrl: Yup.array().min(1, 'Images is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      reasonSelected: ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      // console.log(optionsPartner[0]?.id);
      setSubmitting(false);
      // let flag = false;
      // console.log(values.partnerSide.id);
      // try {
      //   await managePartner.createPartner(values.partnerSide.id, user?.id).then((response) => {
      //     if (response.status == 200) {
      //       flag = true;
      //     }
      //   });
      //   if (flag) {
      //     resetForm();
      //     setSubmitting(false);
      //     enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
      //       variant: 'success'
      //     });
      //     navigate(PATH_DASHBOARD.partner.list);
      //   } else {
      //     enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
      //   }
      // } catch (error) {
      //   console.error(error);
      //   setSubmitting(false);
      // }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={translate('model.order.action.cancel')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <div>
          <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              {translate('model.order.message.dialogTitle')}
            </DialogTitle>
            <DialogContent>
              <FormikProvider value={formik}>
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Grid container spacing={8}>
                    <Grid item xs={12} md={12}>
                      <Card sx={{ p: 8 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 3 }}>
                          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                            {translate('model.order.message.reasonLabel')}
                          </Typography>
                        </Stack>
                        <Stack spacing={10}>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            clearIcon
                            id="reasonSelected"
                            {...getFieldProps('reasonSelected')}
                            options={reasonList}
                            getOptionLabel={(option: any) => option}
                            onChange={(e, value: any) => {
                              setFieldValue('reasonSelected', value);
                              setReasonCombobox(value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={translate('model.order.message.reason')}
                                error={Boolean(touched.reasonSelected && errors.reasonSelected)}
                                helperText={touched.reasonSelected && errors.reasonSelected}
                              />
                            )}
                          />
                          {reasonCombobox == 'Other reason' ? (
                            <Box>
                              <TextField
                                fullWidth
                                label={translate('model.order.message.otherReason')}
                                onChange={onChangeReason}
                              />
                            </Box>
                          ) : (
                            <></>
                          )}
                          <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                              {translate('model.order.action.cancel')}
                            </Button>
                            <Button
                              onClick={(event) => {
                                onCancelOrder(
                                  orderID,
                                  reasonCombobox == 'Other reason' ? getReason : reasonCombobox
                                );
                                handleClose();
                              }}
                            >
                              {translate('model.order.action.confirm')}
                            </Button>
                          </DialogActions>
                        </Stack>
                      </Card>
                    </Grid>
                  </Grid>
                </Form>
              </FormikProvider>
            </DialogContent>
          </Dialog>
        </div>

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.order.root}/${paramCase(orderID)}/detail`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={translate('model.order.action.detail')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
