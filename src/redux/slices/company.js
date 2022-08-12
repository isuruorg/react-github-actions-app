import { reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  companies: []
};

const slice = createSlice({
  name: 'company',
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

    // GET PRODUCTS
    getCompaniesSuccess(state, action) {
      state.isLoading = false;
      state.companies = action.payload;
    },

    // DELETE PRODUCT
    deleteCompany(state, action) {
      state.companies = reject(state.companies, { id: action.payload });
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { deleteCompany } = slice.actions;

// ----------------------------------------------------------------------

export function getCompanies() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/orgs');
      dispatch(slice.actions.getCompaniesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
