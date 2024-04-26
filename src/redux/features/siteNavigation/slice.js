import { createSlice } from '@reduxjs/toolkit'

export const siteNavigationSlice = createSlice({
  name: 'siteNavigation',
  initialState: {
    npub: null,
  },
  reducers: {
    updateNpub: (state, action) => {
      state.npub = action.payload
    },
  },
})

export const { updateNpub } = siteNavigationSlice.actions

export default siteNavigationSlice.reducer
