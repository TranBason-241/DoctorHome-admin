import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { manageService } from '_apis_/service';
import { managePartner } from '_apis_/partner';

import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Diver } from '../../@types/diver';
import { Service } from '../../@types/service';
import { Partner } from '../../@types/partner';

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

type ServiceState = {
  isLoading: boolean;
  error: boolean;
  followers: Follower[];
  partnerList: Partner[];
  totalCount: number;
};

const initialState: ServiceState = {
  totalCount: 0,
  isLoading: false,
  error: false,
  followers: [],
  partnerList: []
};

const slice = createSlice({
  name: 'partnerList',
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

    // GET PARTNER
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // GET LIST PARTNER
    getListPartner(state, action) {
      state.isLoading = false;
      state.partnerList = action.payload;
    },

    // GET TOTAL COUNT
    getTotalCount(state, action) {
      state.isLoading = false;
      state.totalCount = action.payload;
    },
    // DELETE PARTNER
    deletePartner(state, action) {
      const deletePartner = filter(state.partnerList, (partner) => partner.id !== action.payload);
      state.partnerList = deletePartner;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { deletePartner } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListPartner(siteID: string, p_size: number, p_number: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      managePartner.getListPartner(siteID, p_size, p_number + 1).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListPartner(response.data.items));
          dispatch(slice.actions.getTotalCount(response.data.metaData.totalCount));
        } else {
          dispatch(slice.actions.getListPartner([]));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.getListPartner([]));
    }
  };
}
