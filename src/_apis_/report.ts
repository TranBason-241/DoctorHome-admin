import axios from 'axios';

export class ReportManager {
  // get diver by date
  getReportByDate = (date: string, siteID: string) => {
    return axios
      .get(`api/v1/site-manager/report-business?SiteId=${siteID}&DateReport=${date}`)
      .then((res) => res)
      .catch((err) => err);
  };

  getReportByMonth = (date: string, siteID: string, partnerId: String) => {
    return axios
      .get(
        `api/v1/site-manager/report-partner-business?SiteId=${siteID}&PartnerId=${partnerId}&DateReport=${date}`
      )
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageReport = new ReportManager();
