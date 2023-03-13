import axios from 'axios';

export class ExerciseTypeManager {
  // get exercise type list
  getListExerciseType = (level: number) => {
    return axios
      .get('api/v1/exercisegroups/', {
        params: {
          level
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get exercise type by id
  getExerciseTypeID = (partnerSiteID: string) => {
    return axios
      .get(`/api/v1/exercisegroups/${partnerSiteID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create exercise type
  createExerciseType = (partnerID: any, sideID: string) => {
    const data = {
      partnerId: partnerID,
      siteId: sideID
    };
    return axios
      .post('/api/v1/site-manager/partner-sites', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update exercise type
  updateExerciseType = (excerciseType: any) => {
    return axios
      .put('/api/v1/admin/gardens', excerciseType)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete exercise type
  deleteExerciseType = (partnetID: string, siteID: string) => {
    console.log(siteID);
    return axios
      .delete(`/api/v1/site-manager/partner-sites/delete?siteId=${siteID}&partnerId=${partnetID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageExerciseType = new ExerciseTypeManager();
