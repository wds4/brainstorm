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
      state.sidebarShow = action.payload
    },
    updateSidebarUnfoldable: (state, action) => {
      state.sidebarUnfoldable = action.payload
    },
    updateTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const { updateSidebarShow, updateSidebarUnfoldable, updateTheme } = uiSlice.actions

export default uiSlice.reducer
