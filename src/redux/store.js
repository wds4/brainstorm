import { configureStore, combineReducers } from '@reduxjs/toolkit'
import uiReducer from './features/ui/slice'
import profileReducer from './features/profile/slice'
import profilesReducer from './features/profiles/slice'
import siteNavigationReducer from './features/siteNavigation/slice'
import grapevineReducer from './features/grapevine/slice'
import settingsReducer from './features/settings/slice'
import twittrReducer from './features/twittr/slice'
import conceptGraphReducer from './features/conceptGraph/slice'
import wikifreediaReducer from './features/wikifreedia/slice'
import listenerManagerReducer from './features/listenerManager/slice'
import storage from 'redux-persist/lib/storage'
import localforage from 'localforage'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage: localforage,
  stateReconciler: autoMergeLevel2,
}

const rootReducer = combineReducers({
  ui: uiReducer,
  profile: profileReducer,
  profiles: profilesReducer,
  siteNavigation: siteNavigationReducer,
  grapevine: grapevineReducer,
  settings: settingsReducer,
  twittr: twittrReducer,
  conceptGraph: conceptGraphReducer,
  wikifreedia: wikifreediaReducer,
  listenerManager: listenerManagerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
})
export default store

export const persistor = persistStore(store)

/*
// This code:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
// was added due to performance problems that were causing the app to freeze up whenever the WikiListener was active.
// This code turns off a few checks that only run during development mode.
// The freezing up was only a problem during development mode. Makes a gigantic difference.
*/
