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
      const event = action.payload
      state.actions[event.id] = event
    },
    addCategory: (state, action) => {
      const event = action.payload
      state.categories[event.id] = event
    },
    addContext: (state, action) => {
      const event = action.payload
      state.contexts[event.id] = event
    },
    wipeGrapevine: (state, action) => {
      state.actions = {}
      state.categories = {}
      state.contexts = {}
    },
  },
})

export const { addAction, addCategory, addContext, wipeGrapevine } = grapevineSlice.actions

export default grapevineSlice.reducer
