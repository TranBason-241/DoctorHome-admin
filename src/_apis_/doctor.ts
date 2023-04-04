import axios from 'axios';
import { Diver } from '../@types/diver';

export class DoctorManager {
  // get list doctor
  getListDoctor = (p_size: number, p_number: number) => {
    return axios
      .get('/api/v1/doctors', {
        params: {
          limit: p_size,
          'page-offset': p_number
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get doctor by id
  getDoctorByID = (doctorID: string) => {
    return axios
      .get(`api/v1/patients/${doctorID}?search-type=Id`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create Doctor
  createDoctor = (Doctor: any) => {
    return axios
      .post('/api/v1/admin/divers', Doctor, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update Doctor
  updateDoctor = (Doctor: any) => {
    return axios
      .put('/api/v1/admin/divers', Doctor, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete Doctor
  deleteDoctor = (DoctorID: string) => {
    return axios
      .delete(`/api/v1/admin/divers/${DoctorID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageDoctor = new DoctorManager();
