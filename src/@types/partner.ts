import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';
import { Site } from './garden';

export type Partner = {
  id: any;
  name: string;
  phone: string;
  email: string;
  address: string;
  webUrl: string;
  partnerType: {
    id: string;
    name: string;
  };
  status: number;
};

// export type PartnerSite = {
//   id: string;
//   partner: Partner;
// };
