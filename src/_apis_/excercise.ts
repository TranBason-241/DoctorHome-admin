import axios from 'axios';

export class ExcerciseManager {
  // get excercise  list
  getListExcercise = (excerciseTypeId: number, p_size: number, p_number: number) => {
    return axios
      .get('api/v1/exercises', {
        params: {
          'exercise-group': excerciseTypeId,
          page_size: p_size,
          page_number: p_number
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get excercise  by id
  getExcerciseID = (excerciseID: string) => {
    return axios
      .get(`/api/v1/exercisegroups/${excerciseID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create exercise
  createExcercise = (partnerID: any, sideID: string) => {
    const data = {
      partnerId: partnerID,
      siteId: sideID
    };
    return axios
      .post('/api/v1/site-manager/partner-sites', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update excercise
  updateExcercise = (excercise: any) => {
    return axios
      .put('/api/v1/admin/gardens', excercise)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete excercise
  deleteExcercise = (excerciseID: string, siteID: string) => {
    return axios
      .delete(`/api/v1/site-manager/partner-sites/delete?siteId=${siteID}&partnerId=${excerciseID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageExcercise = new ExcerciseManager();
