import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Excercise } from '../../@types/excercise';
import { manageExcercise } from '../../_apis_/excercise';

// ----------------------------------------------------------------------

type ExcerciseState = {
  isLoading: boolean;
  error: boolean;
  excerciseList: Excercise[];
  totalCount: number;
};

const initialState: ExcerciseState = {
  totalCount: 0,
  isLoading: false,
  error: false,
  excerciseList: []
};

const slice = createSlice({
  name: 'excerciseList',
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

    // GET LIST EXCERCISE
    getListExcercise(state, action) {
      state.isLoading = false;
      state.excerciseList = action.payload;
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

// ----------------------------------------------------------------------

// get Diver
export function getListExcercise(excerciseTypeId: number, p_size: number, p_number: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageExcercise.getListExcercise(excerciseTypeId, p_size, p_number + 1).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListExcercise(response.data.content));
          // console.log(response.data.content);
          dispatch(slice.actions.getTotalCount(response.data.totalCount));
        } else {
          dispatch(slice.actions.getListExcercise([]));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.getListExcercise([]));
    }
  };
}
