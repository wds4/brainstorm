import { createSlice } from '@reduxjs/toolkit'
import {
  defDefCon,
  defDefScore,
  defFollInterpScore,
  defFollInterpCon,
  defMuteInterpScore,
  defMuteInterpCon,
  defAttFac,
  defDunbarNumber,
  defRigor,
} from '../../../const'

const defaultInitialState = {
  controlPanels: {
    baseLayer: {
      attenuationFactor: defAttFac,
      dunbarNumber: defDunbarNumber,
      rigor: defRigor,
      defaultUserScore: {
        score: defDefScore,
        confidence: defDefCon,
      },
      followInterpretation: {
        score: defFollInterpScore,
        confidence: defFollInterpCon,
      },
      muteInterpretation: {
        score: defMuteInterpScore,
        confidence: defMuteInterpCon,
      },
    },
  },
  actions: {},
  categories: {},
  contexts: {},
  trustAttestations: {},
}

export const grapevineSlice = createSlice({
  name: 'grapevine',
  initialState: {
    controlPanels: {
      baseLayer: {
        attenuationFactor: defAttFac,
        dunbarNumber: defDunbarNumber,
        defaultUserScore: {
          score: defDefScore,
          confidence: defDefCon,
        },
        followInterpretation: {
          score: defFollInterpScore,
          confidence: defFollInterpCon,
        },
        muteInterpretation: {
          score: defMuteInterpScore,
          confidence: defMuteInterpCon,
        },
      },
    },
    actions: {},
    categories: {},
    contexts: {},
    trustAttestations: {},
  },
  reducers: {
    updateAttenuationFactor: (state, action) => {
      state.controlPanels.baseLayer.attenuationFactor = action.payload
    },
    updateDunbarNumber: (state, action) => {
      state.controlPanels.baseLayer.dunbarNumber = action.payload
    },
    updateRigor: (state, action) => {
      state.controlPanels.baseLayer.rigor = action.payload
    },
    updateDefaultUserScore: (state, action) => {
      state.controlPanels.baseLayer.defaultUserScore.score = action.payload
    },
    updateDefaultUserConfidence: (state, action) => {
      state.controlPanels.baseLayer.defaultUserScore.confidence = action.payload
    },
    updateFollowInterpretationScore: (state, action) => {
      state.controlPanels.baseLayer.followInterpretation.score = action.payload
    },
    updateFollowInterpretationConfidence: (state, action) => {
      state.controlPanels.baseLayer.followInterpretation.confidence = action.payload
    },
    updateMuteInterpretationScore: (state, action) => {
      state.controlPanels.baseLayer.muteInterpretation.score = action.payload
    },
    updateMuteInterpretationConfidence: (state, action) => {
      state.controlPanels.baseLayer.muteInterpretation.confidence = action.payload
    },
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
    addTrustAttestation: (state, action) => {
      const event = action.payload.event
      const cid = action.payload.cid
      state.trustAttestations[cid] = event
    },
    wipeGrapevine: (state, action) => {
      console.log('wipeGrapevine')
      state.controlPanels = {
        baseLayer: {
          attenuationFactor: defAttFac,
          dunbarNumber: defDunbarNumber,
          rigor: defRigor,
          defaultUserScore: {
            score: defDefScore,
            confidence: defDefCon,
          },
          followInterpretation: {
            score: defFollInterpScore,
            confidence: defFollInterpCon,
          },
          muteInterpretation: {
            score: defMuteInterpScore,
            confidence: defMuteInterpCon,
          },
        },
      }
      state.actions = {}
      state.categories = {}
      state.contexts = {}
      state.trustAttestations = {}
    },
  },
})

export const {
  updateAttenuationFactor,
  updateDunbarNumber,
  updateRigor,
  updateDefaultUserScore,
  updateDefaultUserConfidence,
  updateFollowInterpretationScore,
  updateFollowInterpretationConfidence,
  updateMuteInterpretationScore,
  updateMuteInterpretationConfidence,
  addAction,
  addCategory,
  addContext,
  addTrustAttestation,
  wipeGrapevine,
} = grapevineSlice.actions

export default grapevineSlice.reducer
