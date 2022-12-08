import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { ExerciseType } from '../../@types/exerciseType';
import { manageExerciseType } from '../../_apis_/exerciseType';

// ----------------------------------------------------------------------

type ExerciseTypeState = {
  isLoading: boolean;
  error: boolean;
  exerciseTypeList: ExerciseType[];
  totalCount: number;
};

const initialState: ExerciseTypeState = {
  totalCount: 0,
  isLoading: false,
  error: false,
  exerciseTypeList: []
};

const slice = createSlice({
  name: 'exerciseTypeList',
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

    // GET LIST EXERCISE TYPE
    getListPartner(state, action) {
      state.isLoading = false;
      state.exerciseTypeList = action.payload;
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
export function getListExerciseType(level: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageExerciseType.getListExerciseType(level).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListPartner(response.data.content));
          console.log(response.data.content);
          //   dispatch(slice.actions.getTotalCount(response.data.metaData.totalCount));
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
