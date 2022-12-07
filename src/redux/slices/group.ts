import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { manageGroup } from '_apis_/group';
import { manageService } from '_apis_/service';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Diver } from '../../@types/diver';
import { Service } from '../../@types/service';

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
import { Group } from '../../@types/group';

// ----------------------------------------------------------------------

type ServiceState = {
  isLoading: boolean;
  error: boolean;
  followers: Follower[];
  groupList: Group[];
};

const initialState: ServiceState = {
  isLoading: false,
  error: false,
  followers: [],
  groupList: []
};

const slice = createSlice({
  name: 'group',
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

    // GET GROUP
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // GET LIST GROUP
    getGroup(state, action) {
      state.isLoading = false;
      state.groupList = action.payload;
    },

    // DELETE GROUP
    deleteGroupRole(state, action) {
      const deleteGroupRole = filter(
        state.groupList,
        (groupRole) => groupRole.id !== action.payload
      );
      state.groupList = deleteGroupRole;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { deleteGroupRole } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListGroup() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageGroup.getListGroup().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getGroup(response.data.items));
          console.log(response.data.items);
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
