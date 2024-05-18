import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarShow: true,
    theme: 'light',
  },
  reducers: {
    updateSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
    updateTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const { updateSidebarShow, updateTheme } = uiSlice.actions

export default uiSlice.reducer
