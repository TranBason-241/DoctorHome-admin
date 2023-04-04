import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { managePatient } from '_apis_/patient';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Patient } from '../../@types/patient';
import {
  Friend,
  Gallery,
  Profile,
  UserPost,
  Follower,
  UserData,
  CreditCard,
  UserInvoice,
  UserManager,
  UserAddressBook,
  NotificationSettings,
  AreaProvice,
  Coral
} from '../../@types/user';

// ----------------------------------------------------------------------

type PatientState = {
  isLoading: boolean;
  error: boolean;
  followers: Follower[];
  patientList: Patient[];
  totalCount: number;
};

const initialState: PatientState = {
  isLoading: false,
  error: false,
  followers: [],
  patientList: [],
  totalCount: 0
};

const slice = createSlice({
  name: 'patient',
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

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // GET LIST Patient
    getListPatient(state, action) {
      state.isLoading = false;
      state.patientList = action.payload;
    },

    // DELETE DIVER
    deleteDiver(state, action) {
      const deletePatient = filter(state.patientList, (patient) => patient.id !== action.payload);
      state.patientList = deletePatient;
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
export const { deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

// get Diver

export function getListPatient(p_size: number, p_number: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      managePatient.getListPatient(p_size, p_number + 1).then((response) => {
        if (response.status == 200) {
          console.log(response.data.content);
          dispatch(slice.actions.getListPatient(response.data.content));
          dispatch(slice.actions.getTotalCount(response.data.totalCount));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
