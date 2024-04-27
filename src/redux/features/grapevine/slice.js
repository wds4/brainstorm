import { createSlice } from '@reduxjs/toolkit'

export const grapevineSlice = createSlice({
  name: 'grapevine',
  initialState: {
    actions: {},
    categories: {},
    contexts: {},
  },
  reducers: {
    addAction: (state, action) => {
      // state.actions = action.payload
    },
    addCategory: (state, action) => {
      // state.categories = action.payload
    },
    addContext: (state, action) => {
      // state.contexts = action.payload
    },
  },
})

export const { addAction, addCategory, addContext } = grapevineSlice.actions

export default grapevineSlice.reducer
