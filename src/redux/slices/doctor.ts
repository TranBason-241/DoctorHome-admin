import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { managePatient } from '_apis_/patient';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { manageDoctor } from '../../_apis_/doctor';
import { Doctor } from '../../@types/doctor';

// ----------------------------------------------------------------------

type DoctorState = {
  isLoading: boolean;
  error: boolean;
  doctorList: Doctor[];
  totalCount: number;
};

const initialState: DoctorState = {
  isLoading: false,
  error: false,
  doctorList: [],
  totalCount: 0
};

const slice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET LIST doctor
    getListDoctor(state, action) {
      state.isLoading = false;
      state.doctorList = action.payload;
    },

    // DELETE DIVER
    deleteDoctor(state, action) {
      const deleteDoctor = filter(state.doctorList, (doctor) => doctor.id !== action.payload);
      state.doctorList = deleteDoctor;
    },
    // GET TOTAL COUNT
    getTotalCount(state, action) {
      state.isLoading = false;
      state.totalCount = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { deleteDoctor } = slice.actions;

// ----------------------------------------------------------------------

// get Diver

export function getListDoctor(p_size: number, p_number: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageDoctor.getListDoctor(p_size, p_number + 1).then((response) => {
        if (response.status == 200) {
          console.log(response.data.content);
          dispatch(slice.actions.getListDoctor(response.data.content));
          dispatch(slice.actions.getTotalCount(response.data.totalCount));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
