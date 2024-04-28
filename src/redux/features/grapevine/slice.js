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
      let aTags_name = event.tags.filter(([k, v]) => k === 'name' && v && v !== '')
      let aTags_description = event.tags.filter(([k, v]) => k === 'description' && v && v !== '')
      let name = ''
      if (aTags_name.length > 0) {
        name = aTags_name[0][1]
      }
      let description = ''
      if (aTags_description.length > 0) {
        description = aTags_description[0][1]
      }
      state.actions[event.id] = {
        name: name,
        description: description,
      }
    },
    addCategory: (state, action) => {
      const event = action.payload
      let aTags_name = event.tags.filter(([k, v]) => k === 'name' && v && v !== '')
      let aTags_description = event.tags.filter(([k, v]) => k === 'description' && v && v !== '')
      let name = ''
      if (aTags_name.length > 0) {
        name = aTags_name[0][1]
      }
      let description = ''
      if (aTags_description.length > 0) {
        description = aTags_description[0][1]
      }
      state.categories[event.id] = {
        name: name,
        description: description,
      }
    },
    addContext: (state, action) => {
      const event = action.payload
      // unfinished
    },
  },
})

export const { addAction, addCategory, addContext } = grapevineSlice.actions

export default grapevineSlice.reducer
