import { createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const listSlice = createSlice({
  name: 'listSlice',
  initialState: {
    namespaces: [],
    apps: [],
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
    setNamespaces: (state, action) => {
      state.namespaces = action.payload
    },
    setApps: (state, action) => {
      state.apps = action.payload
    },
    clearNamespaces: (state) => {
      state.namespaces = []
    },
    clearApps: (state) => {
      state.apps = []
    },
  },
})

// Selectors - these are used to get data from the store
export const getIsNamespacesEmpty = (state) => {
  return state.listSlice.namespaces.length === 0;
}

export const getIsAppsEmpty = (state) => {
  return state.listSlice.apps.length === 0;
}

export const getMyReservations = (requester) => (state) => {
  return state.listSlice.namespaces.filter(namespace => namespace.requester === requester);
}

export const getNamespaces = (state) => {
  return state.listSlice.namespaces;
}

export const getApps = (state) => {
  return state.listSlice.apps;
}


// Thunks - these are async actions that can be dispatched
export const loadNamespaces = () => {
    return async (dispatch) => {
      try {
        fetch('/api/firelink/namespace/list')
        .then(response => response.json())
        .then(namespaces => {
            dispatch(setNamespaces(namespaces))
        });
      } catch (err) {
        console.log("Error loading namespaces: ", err)
      }
    }
}

export const loadApps = () => {
    return async (dispatch) => {
      try {
        fetch('/api/firelink/apps/list')
        .then(response => response.json())
        .then(apps => {
            dispatch(setApps(apps))
        });
      } catch (err) {
        console.log("Error loading namespaces: ", err)
      }
    }
}


export const { setApps, setNamespaces, clearNamespaces, clearApps } = listSlice.actions

export default listSlice.reducer