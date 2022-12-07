import axios from 'axios';
import { Diver } from '../@types/diver';

export class OrderManager {
  // get list order
  getListOrder = (sideID: string, page_size: number, page_number: number, CreateTime: string) => {
    return axios
      .get('api/v1/site-manager/orders/', {
        params: {
          siteId: sideID,
          page_size,
          page_number,
          CreateTime
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getListOrderByPartnerID = (
    partnerId: string,
    siteId: string,
    page_size: number,
    page_number: number,
    CreateTime: string
  ) => {
    // api/v1/site-manager/orders?siteId=1&PartnerId=1&page_size=50
    return axios
      .get('api/v1/site-manager/orders/', {
        params: {
          partnerId,
          siteId,
          page_size,
          CreateTime
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get order by id
  getOrderByID = (orderID: string) => {
    return axios
      .get(`api/v1/site-manager/orders/${orderID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  cancelOrderByID = (orderID: string, reason: string) => {
    return axios
      .post(`api/v1/site-manager/orders/cancel?id=${orderID}&note=${reason}`)
      .then((response) => response)
      .catch((err) => err);
  };
}
export const manageOrder = new OrderManager();
