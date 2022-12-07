import axios from 'axios';
import { Diver } from '../@types/diver';

export class PartnerManager {
  // get partner list
  getListPartner = (sideID: string, p_size: number, p_number: number) => {
    return axios
      .get('/api/v1/site-manager/partners/sites/', {
        params: {
          siteId: sideID,
          page_size: p_size,
          page_number: p_number
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get Partner by id
  getPartnerByID = (partnerSiteID: string) => {
    return axios
      .get(`/api/v1/site-manager/partners/${partnerSiteID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create Partner
  createPartner = (partnerID: any, sideID: string) => {
    const data = {
      partnerId: partnerID,
      siteId: sideID
    };
    console.log(data);
    return axios
      .post('/api/v1/site-manager/partner-sites', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update diver
  updatePartner = (diver: any) => {
    return axios
      .put('/api/v1/admin/divers', diver, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deletePartner = (partnetID: string, siteID: string) => {
    console.log(siteID);
    return axios
      .delete(`/api/v1/site-manager/partner-sites/delete?siteId=${siteID}&partnerId=${partnetID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // get partner out side

  getPartnerOutSide = (siteid: string) => {
    return axios
      .get(`/api/v1/site-manager/partners/other-partners?siteId=${siteid}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const managePartner = new PartnerManager();
