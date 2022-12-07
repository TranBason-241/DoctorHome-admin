import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';
import { Site } from './garden';

export type Service = {
  id: string;
  name: string;
  // participationAge: string;
  // departureTime: string;
  // pickupPoint: string;
  // duration: string;
  categoryId: any;
  categoryName: string;
  price: string;
  description: string;
  mediaUrl: string;
  site: any;
  status: number;
  images: any[];
  imageUrl: any[];
  quantity: string;
};

export type ProductType = {
  id: string;
  name: string;
  hasQuantity: boolean;
};
