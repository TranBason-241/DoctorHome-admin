import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { manageService } from '_apis_/service';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Diver } from '../../@types/diver';
import { ProductType, Service } from '../../@types/service';
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
  serviceList: Service[];
  productType: ProductType[];
  totalCount: number;
};

const initialState: ServiceState = {
  isLoading: false,
  error: false,
  followers: [],
  serviceList: [],
  productType: [],
  totalCount: 0
};

const slice = createSlice({
  name: 'service',
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

    // GET LIST SERVICE
    getListService(state, action) {
      state.isLoading = false;
      state.serviceList = action.payload;
    },

    // GET TOTAL COUNT
    getTotalCount(state, action) {
      state.isLoading = false;
      state.totalCount = action.payload;
    },
    // DELETE SERVICE
    deleteService(state, action) {
      const deleteDiver = filter(state.serviceList, (diver) => diver.id !== action.payload);
      state.serviceList = deleteDiver;
    },
    // GET LIST PRODUCT TYPE
    getListProductType(state, action) {
      state.isLoading = false;
      state.productType = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { deleteService } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListService(siteId: string, p_size: number, p_number: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageService.getListService(siteId, p_size, p_number + 1).then((response) => {
        if (response.status == 200) {
          console.log(response.data.items);
          dispatch(slice.actions.getListService(response.data.items));
          dispatch(slice.actions.getTotalCount(response.data.metaData.totalCount));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get Diver
export function getListProductType() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageService.getProductType().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListProductType(response.data.items));
          console.log(response.data.items);
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
