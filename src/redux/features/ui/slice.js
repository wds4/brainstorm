import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarShow: true,
    sidebarUnfoldable: false,
    theme: 'light',
  },
  reducers: {
    updateSidebarShow: (state, action) => {
      console.log('uiSlice updateSidebarShow: ' + action.payload)
      state.sidebarShow = action.payload
    },
    updateSidebarUnfoldable: (state, action) => {
      console.log('uiSlice updateSidebarUnfoldable')
      state.sidebarUnfoldable = action.payload
    },
    updateTheme: (state, action) => {
      console.log('uiSlice updateTheme')
      state.theme = action.payload
    },
  },
})

export const { updateSidebarShow, updateSidebarUnfoldable, updateTheme } = uiSlice.actions

export default uiSlice.reducer
