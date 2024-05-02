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
      const event = action.payload.event
      const cid = action.payload.cid
      state.actions[cid] = event
    },
    addCategory: (state, action) => {
      const event = action.payload.event
      const cid = action.payload.cid
      state.categories[cid] = event
    },
    addContext: (state, action) => {
      const event = action.payload.event
      const cid = action.payload.cid
      state.contexts[cid] = event
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
