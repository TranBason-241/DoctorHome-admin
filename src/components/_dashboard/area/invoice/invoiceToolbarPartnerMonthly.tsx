import { Icon } from '@iconify/react';
import { useState } from 'react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Tooltip, IconButton, DialogActions, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import useLocales from 'hooks/useLocales';
// @types
import { Invoice } from '../../../../@types/products';
import { ReportSite } from '../../../../@types/report';
import { SiteInfo } from '../../../../@types/siteInfo';
import { siteManager } from '../../../../@types/user';
//
import { DialogAnimate } from '../../../animate';
import InvoicePDFPartnerMonthly from './InvoicePDFPartnerMonthly';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(5)
}));

// ----------------------------------------------------------------------

type InvoiceToolbarProps = {
  siteReport: ReportSite;
  currentSiteInfo: SiteInfo | any;
  currentSiteManager: siteManager | any;
  date: String;
  user: any;
};

export default function InvoiceToolbarPartnerMonthly({
  currentSiteInfo,
  currentSiteManager,
  siteReport,
  date,
  user,
  ...other
}: InvoiceToolbarProps) {
  const [openPDF, setOpenPDF] = useState(false);
  const { translate } = useLocales();
  const handleOpenPreview = () => {
    setOpenPDF(true);
  };

  const handleClosePreview = () => {
    setOpenPDF(false);
  };

  return (
    <RootStyle {...other}>
      <Button
        color="info"
        size="small"
        variant="contained"
        onClick={handleOpenPreview}
        endIcon={<Icon icon={eyeFill} />}
        sx={{ mx: 1 }}
      >
        {translate('model.report.action.preview')}
      </Button>

      <PDFDownloadLink
        document={
          <InvoicePDFPartnerMonthly
            date={date}
            currentSiteInfo={currentSiteInfo}
            currentSiteManager={currentSiteManager}
            siteReport={siteReport}
            user={user}
          />
        }
        fileName={`INVOICE-${siteReport?.revenue}`}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <LoadingButton
            size="small"
            loading={loading}
            variant="contained"
            loadingPosition="end"
            endIcon={<Icon icon={downloadFill} />}
          >
            {translate('model.report.action.dowload')}
          </LoadingButton>
        )}
      </PDFDownloadLink>

      <DialogAnimate fullScreen open={openPDF}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={handleClosePreview}>
                <Icon icon={closeFill} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDFPartnerMonthly
                date={date}
                currentSiteInfo={currentSiteInfo}
                currentSiteManager={currentSiteManager}
                siteReport={siteReport}
                user={user}
              />
            </PDFViewer>
          </Box>
        </Box>
      </DialogAnimate>
    </RootStyle>
  );
}
