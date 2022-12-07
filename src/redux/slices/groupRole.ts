import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { manageGroupRole } from '_apis_/groupRole';
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
import { GroupRole } from '../../@types/groupRole';

// ----------------------------------------------------------------------

type ServiceState = {
  isLoading: boolean;
  error: boolean;
  followers: Follower[];
  groupRoleList: GroupRole[];
};

const initialState: ServiceState = {
  isLoading: false,
  error: false,
  followers: [],
  groupRoleList: []
};

const slice = createSlice({
  name: 'groupRole',
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

    // GET SERVICE
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // GET LIST GROUP ROLE
    getGroupRole(state, action) {
      state.isLoading = false;
      state.groupRoleList = action.payload;
    },

    // DELETE SERVICE
    deleteGroupRole(state, action) {
      const deleteGroupRole = filter(
        state.groupRoleList,
        (groupRole) => groupRole.id !== action.payload
      );
      state.groupRoleList = deleteGroupRole;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { deleteGroupRole } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListGroupRole() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageGroupRole.getListGroupRole().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getGroupRole(response.data.items));
          console.log(response.data.items);
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
