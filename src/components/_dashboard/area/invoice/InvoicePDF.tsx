import { sum } from 'lodash';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
// utils
import { Divider } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { fCurrency } from '../../../../utils/formatNumber';
// @types

import { Invoice } from '../../../../@types/products';

import { PartnerRPs, PaymentRPs, ReportSite } from '../../../../@types/report';
import { Order } from '../../../../@types/order';
import { SiteInfo } from '../../../../@types/siteInfo';
import { siteManager } from '../../../../@types/user';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }]
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  mb10: { marginBottom: 10 },
  mb20: { marginBottom: 20 },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  revenueColor: { color: 'green' },
  commissionColor: { color: 'red' },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  body20: { fontSize: 20 },
  body2: { fontSize: 8 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign: 'right' },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    textTransform: 'capitalize'
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8'
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { display: 'flex', width: 'auto' },
  tableHeader: { marginTop: 0 },
  tableBody: {},
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8'
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' }
});

// ----------------------------------------------------------------------

type InvoicePDFProps = {
  siteReport: ReportSite;
  currentSiteInfo: SiteInfo;
  currentSiteManager: siteManager;
  date: String;
  user: any;
};

function InvoicePDF({
  siteReport,
  currentSiteInfo,
  date,
  user,
  currentSiteManager
}: InvoicePDFProps) {
  // const { id, items, taxes, status, discount, invoiceTo, invoiceFrom } = siteReport;
  // const subTotal = sum(items.map((item) => item.price * item.qty));
  // const total = subTotal - discount + taxes;
  const { translate } = useLocales();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/static/brand/coral-logo.jpg" style={{ height: 32 }} />
          {/* /static/brand/coral-svgrepo-com.svg */}
        </View>
        <Text style={[styles.overline, styles.mb20, styles.body20, styles.revenueColor]}>
          {translate('model.report.label.dailySaleReport')}
        </Text>
        <View style={[styles.gridContainer, styles.mb20]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>
              {' '}
              {translate('model.report.label.reportFrom')}:{' '}
            </Text>
            <Text style={styles.body1}>
              {' '}
              {translate('model.report.label.siteName')}: {currentSiteInfo?.name}
            </Text>
            <Text style={styles.body1}>
              {' '}
              {translate('model.report.label.address')}: {currentSiteInfo?.address}
            </Text>
            <Text style={styles.body1}>
              {translate('model.report.label.createTime')}:{' '}
              {new Date(date.toString()).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>
              {' '}
              {translate('model.report.label.manager')}
            </Text>
            <Text style={styles.body1}>{user?.displayName}</Text>
            <Text style={styles.body1}>{currentSiteManager?.email}</Text>
            <Text style={styles.body1}>{currentSiteManager?.phone}</Text>
          </View>
        </View>
        {/* sale */}
        <View style={[styles.gridContainer]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8, styles.body1]}>
              {' '}
              {translate('model.report.label.sale')}
            </Text>
            <View style={[styles.gridContainer, styles.mb40]}>
              <View style={styles.col6}>
                <Text style={styles.body1}> {translate('model.report.label.date')}:</Text>
                <Text style={styles.body1}>{translate('model.report.label.numberOfOrder')}:</Text>
                <Text style={styles.body1}> {translate('model.report.label.numberService')}:</Text>
                <Text style={[styles.body1, styles.revenueColor]}>
                  {' '}
                  {translate('model.report.label.revenue')}:
                </Text>
              </View>
              <View style={styles.col6}>
                <Text style={styles.body1}>{new Date(date.toString()).toLocaleDateString()}</Text>
                <Text style={styles.body1}>{siteReport?.numberOfOrder}</Text>
                <Text style={styles.body1}>{siteReport?.numberOfService}</Text>
                <Text style={styles.body1}>
                  {siteReport?.revenue.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.col6}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell_2}>
                    <Text style={styles.subtitle2}>
                      {' '}
                      {translate('model.report.field.tenderType')}
                    </Text>
                  </View>
                  <View style={styles.tableCell_2}>
                    <Text style={styles.subtitle2}>{translate('model.report.field.amount')}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableBody}>
                {siteReport?.paymentRPs.map((payment: PaymentRPs, index: number) => {
                  return (
                    <View style={styles.tableRow} key={index}>
                      <View style={styles.tableCell_2}>
                        <Text>{payment.paymentType}</Text>
                      </View>
                      <View style={styles.tableCell_2}>
                        <Text>
                          {payment.amount.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND'
                          })}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
        {/* COMMISSION */}
        <Text style={[styles.overline, styles.mb8, styles.body1]}>
          {' '}
          {translate('model.report.label.commission')}:
        </Text>
        <View style={[styles.gridContainer]}>
          <View style={styles.col6}>
            <View style={[styles.gridContainer, styles.mb20]}>
              <View style={styles.col6}>
                <Text style={styles.body1}> {translate('model.report.label.total')}:</Text>
                <Text style={[styles.body1, styles.commissionColor]}>
                  {' '}
                  {translate('model.report.label.totalCommisson')}:
                </Text>
              </View>
              <View style={styles.col6}>
                <Text style={styles.body1}>
                  {siteReport?.totalOrderInGroup.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </Text>
                <Text style={styles.body1}>
                  {siteReport?.totalCommission.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.col6}>
            <View style={[styles.gridContainer, styles.mb20]}>
              <View style={styles.col6}>
                <Text style={styles.body1}> {translate('model.report.label.numberOfGroup')}:</Text>
                <Text style={styles.body1}>
                  {' '}
                  {translate('model.report.label.numberOfPartner')}:
                </Text>
              </View>
              <View style={styles.col6}>
                <Text style={styles.body1}>{siteReport?.numberOfGroup}</Text>
                <Text style={styles.body1}>{siteReport?.numberOfPartner}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Partner list */}
        <Text style={[styles.overline, styles.body1]}>
          {translate('model.report.label.partnerList')}:
        </Text>
        <View style={[styles.table, styles.mb20]}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}> {translate('model.report.field.partnerName')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}> {translate('model.report.field.totalGroup')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}> {translate('model.report.field.totalOrder')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}> {translate('model.report.field.total')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>
                  {' '}
                  {translate('model.report.field.totalCommisson')}
                </Text>
              </View>
            </View>
            <View style={styles.tableBody}>
              {siteReport?.partnerRPs.map((partner: PartnerRPs, index: number) => {
                return (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCell_2}>
                      <Text>{partner?.name}</Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>{partner?.totalGroup}</Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>{partner?.totalNumberOrder}</Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>
                        {partner?.totalOrder.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>
                        {partner?.totalCommission.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* <View style={styles.tableBody}>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.title}</Text>
                  <Text>{item.description}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.qty}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.price}</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.price * item.qty)}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Subtotal</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(subTotal)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Discount</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-discount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Taxes</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(taxes)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(total)}</Text>
              </View>
            </View>
          </View> */}
        </View>

        {/* Order list */}
        <Text style={[styles.overline, styles.body1]}>
          {translate('model.report.label.orderList')}:
        </Text>
        <View style={[styles.table, styles.mb40]}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{translate('model.report.field.orderId')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}> {translate('model.report.field.createTime')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{translate('model.report.field.total')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{translate('model.report.field.status')}</Text>
              </View>
            </View>
            <View style={styles.tableBody}>
              {siteReport?.orders.map((order: Order, index: number) => {
                return (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCell_2}>
                      <Text>{order.id}</Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>{order.createTime}</Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>
                        {order.total.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </Text>
                    </View>
                    <View style={styles.tableCell_2}>
                      <Text>
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
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={[styles.alignRight]}>
            <Text style={styles.subtitle2}>{translate('model.report.label.haveAQuestion')}</Text>
            <Text>{currentSiteManager?.email}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePDF;
