import axios from 'axios';
import { Diver } from '../@types/diver';

export class ServiceManager {
  // get list diver
  getListService = (siteId: string, p_size: number, p_number: number) => {
    return axios
      .get('/api/v1/site-manager/products', {
        params: {
          siteId,
          page_size: p_size,
          page_number: p_number
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getServiceByID = (serviceID: string) => {
    return axios
      .get(`/api/v1/site-manager/products/${serviceID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createService = (service: any) => {
    return axios
      .post('/api/v1/site-manager/products', service, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update diver
  updateService = (service: any) => {
    return axios
      .put('/api/v1/site-manager/products', service)
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deleteService = (serviceID: string) => {
    return axios
      .delete(`/api/v1/site-manager/products/${serviceID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // get list product type
  getProductType = () => {
    return axios
      .get('/api/v1/site-manager/categories')
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageService = new ServiceManager();
