import { createSlice } from '@reduxjs/toolkit'
import { fetchFirstByTag } from 'src/helpers'
import { aDefaultRelays } from 'src/const'

const aMyPersonalTestRelay = ['ws://umbrel.local:4848']

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    general: {
      listenerMethod: 'individualListeners', // 'v3Listeners' (soon to be option 1) vs 'individualListeners' (option 2) vs 'oneMainListener' (option 3)
      listeners: {
        // toggle individual listeners on and off
        listener1: 'hide',
        listener2: 'hide',
        listener3: 'hide',
        listener4: 'hide',
        listener5: 'hide',
      },
      developmentMode: 'hide', // 'show' or 'hide';  features that are under development
      showListenerManager: 'hide', // show or hide
      aActiveRelays: aDefaultRelays, // aDefaultRelays,
      aActiveRelaysGroups: ['default'], // default (defined by app), personalRelay (one relay stored in conceptGraphSettings), or profile (extracted from kind 3 event)
      loginRelayUrl: '', // the relay entered by the user at login; if empty, aDefaultRelays will be used; otheriwse loginRelayUrl will be used
    },
    grapevine: {
      scoreUpdates: {
        // record when various wotScores were updated and how many profiles were in the database at the time of the calculation. Prompt user to repeat calculation when lots of new profiles are downloaded.
        degreesOfSeparation: {
          numProfiles: 0,
          timestamp: 0,
        },
        wotScore: {
          numProfiles: 0,
          timestamp: 0,
        },
        influenceScore: {
          numProfiles: 0,
          timestamp: 0,
        },
      },
    },
    conceptGraph: {
      conceptGraphSettingsEvent: {}, // this is the entire kind 39902 event, of word type: conceptGraphSettings
      personalRelay: '', // extracted from conceptGraphSettingsData
    },
    twittr: {},
  },
  reducers: {
    toggleIndividualListener: (state, action) => {
      console.log('toggleIndividualListener')
      const { newState, num } = action.payload
      console.log('toggleIndividualListener; num: ' + num)
      const whichListener = 'listener' + num
      if (!state.general.listeners) {
        state.general.listeners = {}
        state.general.listeners.listener1 = 'hide'
        state.general.listeners.listener2 = 'hide'
        state.general.listeners.listener3 = 'hide'
        state.general.listeners.listener4 = 'hide'
        state.general.listeners.listener5 = 'hide'
      }
      state.general.listeners[whichListener] = newState // 'show' or 'hide'
    },
    updateGrapevineScores: (state, action) => {
      const { scoreType, numProfiles } = action.payload
      const currentTime = Math.floor(Date.now() / 1000)
      if (!state.grapevine.scoreUpdates) {
        state.grapevine.scoreUpdates = {}
        state.grapevine.scoreUpdates.degreesOfSeparation = {}
        state.grapevine.scoreUpdates.wotScore = {}
        state.grapevine.scoreUpdates.influenceScore = {}
      }
      // work in progress
      state.grapevine.scoreUpdates[scoreType] = {}
      state.grapevine.scoreUpdates[scoreType].numProfiles = numProfiles
      state.grapevine.scoreUpdates[scoreType].timestamp = currentTime
    },
    updateListenerMethod: (state, action) => {
      state.general.listenerMethod = action.payload
    },
    updateDevelopmentMode: (state, action) => {
      state.general.developmentMode = action.payload
    },
    updateShowListenerManagerMode: (state, action) => {
      state.general.showListenerManager = action.payload
    },
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
        listenerMethod: 'individualListeners',
        developmentMode: 'hide',
        showListenerManager: 'hide',
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
  toggleIndividualListener,
  updateGrapevineScores,
  updateListenerMethod,
  updateDevelopmentMode,
  updateShowListenerManagerMode,
  updateConceptGraphSettingsEvent,
  updateActiveRelaysGroups,
  updateActiveRelays,
  updateLoginRelayUrl,
  wipeSettings,
} = settingsSlice.actions

export default settingsSlice.reducer
