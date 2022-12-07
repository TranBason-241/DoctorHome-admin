import { Group } from './group';
import { Order } from './order';

export type PaymentRPs = {
  paymentType: string;
  amount: number;
};
export type PartnerRPs = {
  name: string;
  totalGroup: number;
  totalNumberOrder: number;
  totalOrder: number;
  totalCommission: number;
};
export type ReportSite = {
  revenue: number;
  commission: number;
  numberOfGroup: number;
  numberOfOrder: number;
  numberOfService: number;
  numberOfPartner: number;
  totalOrderInGroup: number;
  totalCommission: number;
  paymentRPs: PaymentRPs[];
  partnerRPs: PartnerRPs[];
  orders: Order[];
  groups: Group[];
};
