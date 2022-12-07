import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';
import { Site } from './garden';
import { Service } from './service';

export type Order = {
  id: string;
  name: string;
  createTime: string;
  total: number;
  email: string;
  phone: string;
  groupId: any;
  mediaUrl: string;
  staffId: any;
  nationalityCode: string;
  nationalityName: string;
  status: number;
  statusEnum: string;
  orderDetails: OrderDetails[];
  note: string;
};

export type OrderDetails = {
  id: string;
  price: string;
  quantity: string;
  productId: string;
  productName: String;
};

export type MonthList = {
  month: string;
  listOrder: Order[];
};
