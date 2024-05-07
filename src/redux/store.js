import { configureStore, combineReducers } from '@reduxjs/toolkit'
import uiReducer from './features/ui/slice'
import profileReducer from './features/profile/slice'
import siteNavigationReducer from './features/siteNavigation/slice'
import grapevineReducer from './features/grapevine/slice'
import settingsReducer from './features/settings/slice'
import twittrReducer from './features/twittr/slice'
import conceptGraphReducer from './features/conceptGraph/slice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
}

const rootReducer = combineReducers({
  ui: uiReducer,
  profile: profileReducer,
  siteNavigation: siteNavigationReducer,
  grapevine: grapevineReducer,
  settings: settingsReducer,
  twittr: twittrReducer,
  conceptGraph: conceptGraphReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
})
export default store

export const persistor = persistStore(store)
