import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  chains: [],
  totalChains: 0,
  skipped: 0,
  currentStore: null,
  selectedChain: '',
  currentFeature: {},
  dataEntryCount: 0,
  dashboardChainCount: 0,
  storesForChain: []
};

const slice = createSlice({
  name: 'chain',
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

    // GET PROFILE
    getChainsSuccess(state, action) {
      state.isLoading = false;
      state.chains = action.payload;
    },
    getTotalChainsSuccess(state, action) {
      state.isLoading = false;
      state.totalChains = action.payload;
    },
    getCurrentStoreSuccess(state, action) {
      state.isLoading = false;
      state.currentStore = action.payload;
    },
    upadteSkippedSuccess(state, action) {
      state.skipped = action.payload;
    },
    setSelectedChain(state, action) {
      state.selectedChain = action.payload;
    },
    setSelectedFeature(state, action) {
      state.currentFeature = action.payload;
    },
    getDataEntryCountsSuccess(state, action) {
      state.dataEntryCount = action.payload;
    },
    getDashboardTotalChainsSuccess(state, action) {
      state.isLoading = false;
      state.dashboardChainCount = action.payload;
    },
    setStoresForChain(state, action) {
      state.isLoading = false;
      state.storesForChain = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteUser } = slice.actions;

// ------------------------------------------------------`----------------

export function getChains(skip = 1, limit = 10) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/stores/chains/percentages?skip=${skip}&limit=${limit}`);
      const { data, error } = response.data;
      if (error) {
        dispatch(slice.actions.hasError(error));
      } else {
        dispatch(slice.actions.getChainsSuccess(data.chains));
        dispatch(slice.actions.getTotalChainsSuccess(data.totalChains));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTotalChainCOunt() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/stores/chains/count');
      const { data, error } = response.data;
      if (error) dispatch(slice.actions.hasError(error));
      else dispatch(slice.actions.getDashboardTotalChainsSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNextStore(chain, skipped) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.setSelectedChain(chain));
      dispatch(slice.actions.setSelectedFeature([]));

      const response = await axios.post('/stores/next', { chain, skipped });
      const { data, error } = response.data;
      if (error) {
        dispatch(slice.actions.hasError(error));
      } else {
        const { store, gps } = data;
        const gpsSplitted = gps.split(',');
        store.cordinates =
          gpsSplitted && gpsSplitted.length === 2
            ? { Latitude: gpsSplitted[0], Longitude: gpsSplitted[1] }
            : { Latitude: null, Longitude: null };
        dispatch(slice.actions.upadteSkippedSuccess(Number(skipped) + 1));
        dispatch(slice.actions.getCurrentStoreSuccess(store));
      }
      // dispatch(slice.actions.getFriendsSuccess(response.data.friends));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
    dispatch(getStoresForChain(chain));
  };
}

export function setSelectedStore(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.setSelectedFeature([]));
      const response = await axios.get(`/stores/gps/${id}`);
      const { data, error } = response.data;

      if (error) {
        dispatch(slice.actions.hasError(error));
      } else {
        const { store, gps } = data.data;
        const gpsSplitted = gps.split(',');
        store.cordinates =
          gpsSplitted && gpsSplitted.length === 2
            ? { Latitude: gpsSplitted[0], Longitude: gpsSplitted[1] }
            : { Latitude: null, Longitude: null };
        dispatch(slice.actions.getCurrentStoreSuccess(store));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateSkipped(skipped) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.upadteSkippedSuccess(Number(skipped) + 1));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function onPolygonDraw(feature) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.setSelectedFeature(feature));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function onPolygonDelete() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.setSelectedFeature([]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getDataEntryCounts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/stores/dataEntry/counts');
      const { data, error } = response.data;
      if (error) {
        dispatch(slice.actions.hasError(error));
      } else {
        dispatch(slice.actions.getDataEntryCountsSuccess(data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getStoresForChain(chain) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/stores/chains/${chain}`);
      const { data, error } = response.data;
      if (error) {
        dispatch(slice.actions.hasError(error));
      } else {
        dispatch(slice.actions.setStoresForChain(data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/user/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get('/api/user/all');
      const res = await axios.get('/users');
      dispatch(slice.actions.getUsersSuccess(res.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
