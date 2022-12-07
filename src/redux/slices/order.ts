import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { manageService } from '_apis_/service';
import { manageOrder } from '_apis_/order';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Diver } from '../../@types/diver';
import { Service } from '../../@types/service';
import { Order } from '../../@types/order';
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
  totalCount: number;
  isLoading: boolean;
  error: boolean;
  followers: Follower[];
  orderList: Order[];
};

const initialState: ServiceState = {
  totalCount: 0,
  isLoading: false,
  error: false,
  followers: [],
  orderList: []
};

const slice = createSlice({
  name: 'order',
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

    // GET LIST ORDER
    getListOrder(state, action) {
      state.isLoading = false;
      state.orderList = action.payload;
    },
    // GET TOTAL COUNT
    getTotalCount(state, action) {
      state.isLoading = false;
      state.totalCount = action.payload;
    },

    // DELETE SERVICE
    deleteService(state, action) {
      const deleteDiver = filter(state.orderList, (diver) => diver.id !== action.payload);
      state.orderList = deleteDiver;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { deleteService } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListOrder(sideID: string, p_size: number, p_number: number, date: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageOrder.getListOrder(sideID, p_size, p_number + 1, date).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListOrder(response.data.items));
          dispatch(slice.actions.getTotalCount(response.data.metaData.totalCount));
        } else {
          dispatch(slice.actions.getListOrder([]));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.getListOrder([]));
    }
  };
}

export function getListOrderByPartnerID(
  partnerId: string,
  sideID: string,
  p_size: number,
  p_number: number,
  date: string
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageOrder
        .getListOrderByPartnerID(partnerId, sideID, p_size, p_number + 1, date)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            dispatch(slice.actions.getListOrder(response.data.items));
            dispatch(slice.actions.getTotalCount(response.data.metaData.totalCount));
          } else {
            dispatch(slice.actions.getListOrder([]));
          }
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.getListOrder([]));
    }
  };
}
