import faker from 'faker';
import { sum } from 'lodash';
// material
import { styled } from '@material-ui/core/styles';
import { DesktopDatePicker } from '@material-ui/lab';
import moment from 'moment';
import {
  Box,
  Grid,
  Card,
  Table,
  Divider,
  TableRow,
  Container,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  TextField,
  Stack,
  Autocomplete,
  CircularProgress
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import useLocales from 'hooks/useLocales';
import { manageReport } from '_apis_/report';
// hooks
import useAuth from 'hooks/useAuth';
// routes
import { useParams } from 'react-router';
import InvoiceToolbarPartnerMonthly from 'components/_dashboard/area/invoice/invoiceToolbarPartnerMonthly';
// utils
import { manageSiteInfo } from '_apis_/siteInfo';
import useSettings from '../../hooks/useSettings';
import { PartnerRPs, PaymentRPs, ReportSite } from '../../@types/report';
import { Order } from '../../@types/order';
import { siteManager } from '../../@types/user';
import { SiteInfo } from '../../@types/siteInfo';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';

import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const INVOICE = {
  id: faker.datatype.uuid(),
  taxes: 5,
  discount: 10,
  status: 'paid',
  invoiceFrom: {
    name: faker.name.findName(),
    address: 'DieSachbearbeiter Choriner Straße 49 10435 Berlin',
    company: faker.company.companyName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat()
  },
  invoiceTo: {
    name: faker.name.findName(),
    address: 'Keas 69 Str. 15234, Chalandri Athens, Greece',
    company: faker.company.companyName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat()
  },
  items: [...Array(3)].map(() => ({
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.lines(),
    qty: faker.datatype.number({ min: 1, max: 5 }),
    price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 })
  }))
};

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2)
  }
}));

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}));

// ----------------------------------------------------------------------

type partnerMonthlyReportType = {
  name: string;
};
export default function PartnerMonthlyReport({ name }: partnerMonthlyReportType) {
  const [currentSiteInfo, setCurrentSiteInfo] = useState<SiteInfo>();
  const [currentSiteManager, setCurrentSiteManager] = useState<siteManager>();
  const { themeStretch } = useSettings();
  const subTotal = sum(INVOICE.items.map((item) => item.price * item.qty));
  const total = subTotal - INVOICE.discount + INVOICE.taxes;
  //   const [currentReport, setCurrentReport] = useState<Report>();
  const { user } = useAuth();
  function convertUTCDateToLocalDate(date: any) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }
  const [siteReport, setSiteReport] = useState<ReportSite | any>();
  const [date, setDate] = useState(new Date().toString());
  const [isloading, setIsloading] = useState(false);
  const { translate } = useLocales();
  const handleChange = (newValue: any) => {
    const newDate = new Date(newValue);
    setDate(newDate.toString());
  };
  useEffect(() => {
    // const today = new Date().toLocaleDateString();
    // setDate(today.toString());

    manageSiteInfo.getSiteInfoByID(user?.siteid).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          imageUrl: response.data.imageUrl,
          createTime: response.data.createTime,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          webUrl: response.data.webUrl,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          status: response.data.status,
          listGarden: response.data.listGarden
        };
        setCurrentSiteInfo(data);
      }
      manageSiteInfo.getSiteManagerInfo(user?.id).then((response) => {
        if (response.status == 200) {
          setCurrentSiteManager(response.data);
        }
      });
    });
  }, []);
  const fetchData = async () => {
    const newDate = new Date(date);
    const dateFormat = moment(newDate).format('yyyy/MM/DD');
    console.log(date);
    console.log(dateFormat);
    setIsloading(false);
    await manageReport.getReportByMonth(dateFormat, user?.siteid, name).then((rs) => {
      if (rs.status == 200) {
        setSiteReport(rs.data);
      } else {
        setSiteReport(null);
      }
    });
    setIsloading(true);
  };
  useEffect(() => {
    fetchData();
  }, [date]);
  const top100Films = ['Daily report', 'Month'];
  return (
    <Page title="Báo cáo bán hàng hằng ngày">
      {!isloading ? (
        <Stack sx={{ mt: 3 }} alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          {/* <HeaderBreadcrumbs
          heading="Report"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.area.root
            },
            { name: 'Invoice' }
          ]}
        /> */}

          <Stack spacing={3} sx={{ mt: 5, mb: 5 }} maxWidth="98%">
            <Typography sx={{ color: '' }} variant="h5">
              {translate('model.report.label.searchReport')}
            </Typography>
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item xs={6} md={6}>
                <DesktopDatePicker
                  maxDate={new Date()}
                  views={['year', 'month']}
                  label={translate('model.report.label.month')}
                  inputFormat="yyyy/MM"
                  value={date}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <InvoiceToolbarPartnerMonthly
                  date={date}
                  siteReport={siteReport}
                  currentSiteInfo={currentSiteInfo}
                  currentSiteManager={currentSiteManager}
                  user={user}
                />
              </Grid>
            </Grid>
          </Stack>
          <Card sx={{ pt: 5, px: 5 }}>
            <Grid container>
              <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                <Box
                  component="img"
                  alt="logo"
                  src="/static/brand/coral-svgrepo-com.svg"
                  sx={{ height: 48 }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                <Typography sx={{ color: 'text.disabled' }} variant="h6">
                  Repordt ID- {date}
                  Site
                </Typography>
              </Box>
            </Grid> */}
              <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
                <Typography paragraph variant="h3" sx={{ color: 'green' }}>
                  {translate('model.report.label.monthlySaleReport')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.secondary' }}>
                  {translate('model.report.label.reportFrom')}
                </Typography>
                <Typography variant="body2">
                  {' '}
                  {translate('model.report.label.siteName')}: {currentSiteInfo?.name}
                </Typography>
                <Typography variant="body2">
                  {' '}
                  {translate('model.report.label.address')}: {currentSiteInfo?.address}
                </Typography>
                {/* <Typography variant="body2">Phone: {INVOICE.invoiceFrom.phone}</Typography> */}
                <Typography variant="body2">
                  {translate('model.report.label.createTime')}:{' '}
                  {new Date(date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  {translate('model.report.label.manager')}
                </Typography>
                <Typography variant="body2">{user?.displayName}</Typography>
                <Typography variant="body2">{currentSiteManager?.email}</Typography>
                <Typography variant="body2">{currentSiteManager?.phone}</Typography>
              </Grid>
            </Grid>
            {/* <Typography
            sx={{ color: 'text.secondary', fontSize: '20px', pb: 2, mt: 3 }}
            variant="subtitle2"
          >
            Environmental information
          </Typography> */}
            <Divider />
            <Grid
              container
              maxWidth="70%"
              justifyContent="space-between"
              spacing={2}
              sx={{ mt: 2, ml: 0, mb: 3 }}
            >
              <Grid item xs={6} md={6}>
                <RowStyle>
                  <Typography variant="h5" sx={{ color: 'black' }}>
                    {translate('model.report.label.sale')}
                  </Typography>
                </RowStyle>
                <RowStyle>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    {translate('model.report.label.date')}
                  </Typography>
                  <Typography variant="body2">{new Date(date).toLocaleDateString()}</Typography>
                </RowStyle>
                {/* <RowStyle>
                <Typography variant="subtitle1" sx={{ color: 'red' }}>
                  Commission
                </Typography>
                <Typography variant="body2">20000</Typography>
              </RowStyle> */}
                <RowStyle>
                  <Typography variant="inherit" sx={{ color: 'text.secondary' }}>
                    {translate('model.report.label.numberOfOrder')}
                  </Typography>
                  <Typography variant="body2">{siteReport?.numberOfOrder}</Typography>
                </RowStyle>
                <RowStyle>
                  <Typography variant="inherit" sx={{ color: 'text.secondary' }}>
                    {translate('model.report.label.numberService')}
                  </Typography>
                  <Typography variant="body2">{siteReport?.numberOfService}</Typography>
                </RowStyle>{' '}
                <RowStyle>
                  <Typography variant="subtitle1" sx={{ color: 'green ' }}>
                    {translate('model.report.label.revenue')}:
                  </Typography>
                  <Typography variant="body2">
                    {/* {siteReport?.revenue} */}
                    {parseInt(siteReport?.revenue, 10).toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND'
                    })}
                  </Typography>
                </RowStyle>
              </Grid>
              {/* <Divider orientation="vertical" flexItem /> */}

              <Grid sx={{ mt: 3 }} item xs={4} md={4}>
                <TableContainer sx={{ minWidth: 300 }}>
                  <Table>
                    <TableHead
                      sx={{
                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        '& th': { backgroundColor: 'transparent' }
                      }}
                    >
                      <TableRow>
                        <TableCell width={150}>
                          {translate('model.report.field.tenderType')}
                        </TableCell>
                        <TableCell align="left">{translate('model.report.field.amount')}</TableCell>
                        {/* <TableCell align="left">Card type</TableCell> */}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {siteReport?.paymentRPs.map((payment: PaymentRPs, index: number) => {
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                            }}
                          >
                            <TableCell>
                              {payment?.paymentType == 'cash' ? 'Tiền mặt' : payment?.paymentType}
                            </TableCell>
                            <TableCell align="left">
                              {/* {payment.amount}{' '} */}
                              {payment.amount.toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND'
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Stack sx={{ mt: 2 }} maxWidth="35%">
              <Divider />
            </Stack>
            <Grid
              container
              maxWidth="100%"
              // justifyContent="space-between"
              spacing={2}
              sx={{ mt: 1, ml: 0, mb: 5 }}
            >
              <Grid item xs={12} md={12}>
                <RowStyle>
                  <Typography variant="h5" sx={{ color: 'black' }}>
                    {translate('model.report.label.commission')}:
                  </Typography>
                </RowStyle>
              </Grid>
              <Grid item xs={6} md={6}>
                <Stack maxWidth="67%">
                  <RowStyle>
                    <Typography variant="inherit" sx={{ color: 'text.secondary' }}>
                      {translate('model.report.label.total')}:
                    </Typography>
                    <Typography variant="body2">
                      {/* {siteReport?.totalOrderInGroup} */}
                      {parseInt(siteReport?.totalOrderInGroup, 10).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </Typography>
                  </RowStyle>

                  <RowStyle>
                    <Typography variant="subtitle1" sx={{ color: 'red' }}>
                      {translate('model.report.label.totalCommisson')}:
                    </Typography>
                    <Typography variant="body2">
                      {/* {siteReport?.totalCommission} */}
                      {parseInt(siteReport?.totalCommission, 10).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </Typography>
                  </RowStyle>
                </Stack>
              </Grid>
              <Grid item xs={6} md={6}>
                <Stack maxWidth="67%">
                  <RowStyle>
                    <Typography variant="inherit" sx={{ color: 'text.secondary' }}>
                      {translate('model.report.label.numberOfGroup')}:
                    </Typography>
                    <Typography variant="body2">{siteReport?.numberOfGroup}</Typography>
                  </RowStyle>
                </Stack>
              </Grid>
            </Grid>
            {/* <Stack sx={{ mb: 1 }} maxWidth="35%">
              <Divider textAlign="left"> {translate('model.report.label.partnerList')}:</Divider>
            </Stack> */}
            {/* <TableContainer sx={{ minWidth: 400 }}>
              <Table>
                <TableHead
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    '& th': { backgroundColor: 'transparent' }
                  }}
                >
                  <TableRow>
                    <TableCell align="left" style={{ width: '20%' }}>
                      {translate('model.report.field.partnerName')}
                    </TableCell>
                    <TableCell align="left" style={{ width: '20%' }}>
                      {translate('model.report.field.totalGroup')}
                    </TableCell>
                    <TableCell align="left" style={{ width: '20%' }}>
                      {translate('model.report.field.totalOrder')}
                    </TableCell>
                    <TableCell align="left" style={{ width: '20%' }}>
                      {translate('model.report.field.total')}
                    </TableCell>
                    <TableCell style={{ width: '20%' }} width={120}>
                      {translate('model.report.field.totalCommisson')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
             
                  {siteReport?.partnerRPs.map((partner: PartnerRPs, index: number) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                        }}
                      >
                        <TableCell>{partner.name}</TableCell>
                        <TableCell align="left">{partner.totalGroup}</TableCell>
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 460 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {partner.totalNumberOrder}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {partner.totalOrder}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left"> {partner.totalCommission}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer> */}
            <Stack sx={{ mt: 5 }} maxWidth="35%">
              <Divider textAlign="left"> {translate('model.report.label.orderList')}:</Divider>
            </Stack>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 960 }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' }
                    }}
                  >
                    <TableRow>
                      <TableCell width={200}> {translate('model.report.field.orderId')}</TableCell>

                      <TableCell align="left">
                        {' '}
                        {translate('model.report.field.createTime')}
                      </TableCell>
                      <TableCell align="left"> {translate('model.report.field.total')}</TableCell>
                      <TableCell align="left"> {translate('model.report.field.status')}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {siteReport?.orders.map((order: Order, index: number) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                          }}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 460 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {convertUTCDateToLocalDate(order.createTime)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 300 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {/* {order.total} */}
                                {order?.total?.toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND'
                                })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="left">
                            {' '}
                            {(() => {
                              switch (order.status) {
                                case 1:
                                  return 'New';
                                case 0:
                                  return 'Cancel';
                                case 3:
                                  return 'Hoàn thành';
                                default:
                                  return 'null';
                              }
                            })()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Divider sx={{ mt: 5 }} />

            <Grid container>
              <Grid item xs={12} md={9} sx={{ py: 3 }}>
                {/* <Typography variant="subtitle2">NOTES</Typography>
              <Typography variant="body2">
                We appreciate your business. Should you need us to add VAT or extra notes let us
                know!
              </Typography> */}
              </Grid>
              <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
                <Typography variant="subtitle2">
                  {translate('model.report.label.haveAQuestion')}
                </Typography>
                <Typography variant="body2">{currentSiteManager?.email}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Container>
      )}
    </Page>
  );
}
