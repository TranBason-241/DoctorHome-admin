import axios from 'axios';

export class SiteInfoManager {
  // get groupRole by id
  getSiteInfoByID = (siteInfoID: string) => {
    return axios
      .get(`api/v1/site-manager/sites/${siteInfoID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // update groupRole
  updateSiteInfo = (siteInfo: any) => {
    return axios
      .put('/api/v1/site-manager/sites', siteInfo, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete groupRole
  deleteGroupRole = (groupRoleID: string) => {
    return axios
      .delete(`/api/v1/site-manager/group-roles/${groupRoleID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  getSiteManagerInfo = (id: string) => {
    return axios
      .get(`/api/v1/site-manager/employees/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageSiteInfo = new SiteInfoManager();
