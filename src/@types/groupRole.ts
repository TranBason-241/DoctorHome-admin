import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';
import { Site } from './garden';

export type GroupRole = {
  id: string;
  name: string;
  personalRate: number;
  partnerRate: number;
};
