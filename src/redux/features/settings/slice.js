import { createSlice } from '@reduxjs/toolkit'
import { fetchFirstByTag } from '../../../helpers'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    general: {},
    grapevine: {},
    conceptGraph: {
      conceptGraphSettingsEvent: {}, // this is the entire kind 39902 event, of word type: conceptGraphSettings
      personalRelay: '', // extracted from conceptGraphSettingsData
    },
    twittr: {},
  },
  reducers: {
    updateConceptGraphSettingsEvent: (state, action) => {
      const event = action.payload.event
      state.conceptGraph.conceptGraphSettingsEvent = event
      const sWord = fetchFirstByTag('word', event)
      const oWord = JSON.parse(sWord)
      const personalRelay = oWord?.conceptGraphSettingsData.personalRelay
      state.conceptGraph.personalRelay = personalRelay
    },
    wipeSettings: (state, action) => {
      state.general = {}
      state.grapevine = {}
      state.conceptGraph = {
        conceptGraphSettingsEvent: {},
        personalRelay: '',
      }
      state.twittr = {}
    },
  },
})

export const { updateConceptGraphSettingsEvent, wipeSettings } = settingsSlice.actions

export default settingsSlice.reducer
