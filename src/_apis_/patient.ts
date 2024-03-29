import axios from 'axios';
import { Diver } from '../@types/diver';

export class PatientManager {
  // get list patient
  getListPatient = (p_size: number, p_number: number) => {
    return axios
      .get('/api/v1/patients', {
        params: {
          limit: p_size,
          'page-offset': p_number
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get Patient by id
  getPatientByID = (patientID: string) => {
    return axios
      .get(`api/v1/patients/${patientID}?search-type=Id`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create Patient
  createPatient = (patient: any) => {
    return axios
      .post('/api/v1/admin/divers', patient, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update Patient
  updatePatient = (patient: any) => {
    return axios
      .put('/api/v1/admin/divers', patient, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete Patient
  deletePatient = (patientID: string) => {
    return axios
      .delete(`/api/v1/admin/divers/${patientID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const managePatient = new PatientManager();
