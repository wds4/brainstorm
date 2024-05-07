import { createSlice } from '@reduxjs/toolkit'
import { fetchFirstByTag } from 'src/helpers'
import { aDefaultRelays } from 'src/const'

const aMyPersonalTestRelay = ['ws://umbrel.local:4848']

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    general: {
      aActiveRelays: aDefaultRelays, // aDefaultRelays,
      aActiveRelaysGroups: ['default'], // default (defined by app), personalRelay (one relay stored in conceptGraphSettings), or profile (extracted from kind 3 event)
      loginRelayUrl: '', // the relay entered by the user at login; if empty, aDefaultRelays will be used; otheriwse loginRelayUrl will be used
    },
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
    updateActiveRelaysGroups: (state, action) => {
      state.general.aActiveRelaysGroups = action.payload
    },
    updateActiveRelays: (state, action) => {
      state.general.aActiveRelays = action.payload
    },
    updateLoginRelayUrl: (state, action) => {
      state.general.loginRelayUrl = action.payload
    },
    wipeSettings: (state, action) => {
      state.general = {
        aActiveRelays: aDefaultRelays,
        aActiveRelaysGroups: ['default'],
        loginRelayUrl: '',
      }
      state.grapevine = {}
      state.conceptGraph = {
        conceptGraphSettingsEvent: {},
        personalRelay: '',
      }
      state.twittr = {}
    },
  },
})

export const {
  updateConceptGraphSettingsEvent,
  updateActiveRelaysGroups,
  updateActiveRelays,
  updateLoginRelayUrl,
  wipeSettings,
} = settingsSlice.actions

export default settingsSlice.reducer
