import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';

export type SiteInfo = {
  id: string;
  name: string;
  imageUrl: string;
  createTime: string;
  phone: string;
  email: string;
  address: string;
  webUrl: string;
  latitude: string;
  longitude: string;
  status: string;
  listGarden: any;
};
