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
  defContDiscRigor,
  defFireInterpScore,
  defThumbUpInterpScore,
  defThumbDownInterpScore,
  defContextualEndorsementInterpCon,
  defContextualWikiLikeInterpScore,
  defContextualWikiLikeInterpCon,
  defContextualWikiDislikeInterpScore,
  defContextualWikiDislikeInterpCon,
} from '../../../const'
import { fetchFirstByTag } from '../../../helpers'

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
    contentDiscovery: {
      rigor: defContDiscRigor,
      contextualEndorsements: {
        score: {
          fire: defFireInterpScore,
          thumbUp: defThumbUpInterpScore,
          thumbDown: defThumbDownInterpScore,
        },
        confidence: defContextualEndorsementInterpCon,
      },
      wikiReactions: {
        likes: {
          score: defContextualWikiLikeInterpScore,
          confidence: defContextualWikiLikeInterpCon,
        },
        dislikes: {
          score: defContextualWikiDislikeInterpScore,
          confidence: defContextualWikiDislikeInterpCon,
        },
      },
    },
  },
  actions: {},
  categories: {},
  contexts: {},
  trustAttestations: {},
  contextualEndorsements: { // issued on profile page
    byCid: {},
    byContext: {}, // context as a string
  },
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
      contentDiscovery: {
        rigor: defContDiscRigor,
        contextualEndorsements: {
          score: {
            fire: defFireInterpScore,
            thumbUp: defThumbUpInterpScore,
            thumbDown: defThumbDownInterpScore,
          },
          confidence: defContextualEndorsementInterpCon,
        },
        wikiReactions: {
          likes: {
            score: defContextualWikiLikeInterpScore,
            confidence: defContextualWikiLikeInterpCon,
          },
          dislikes: {
            score: defContextualWikiDislikeInterpScore,
            confidence: defContextualWikiDislikeInterpCon,
          },
        },
      },
    },
    actions: {},
    categories: {},
    contexts: {},
    trustAttestations: {},
    contextualEndorsements: { // issued on profile page
      byCid: {},
      byContext: {}, // context as a string
    },
  },
  reducers: {
    createContentDiscoveryControlPanel: (state, action) => { // patch bug for users who logged in prior to addition of controlPanels.contentDiscovery
      console.log('createContentDiscoveryControlPanel')
      state.controlPanels.contentDiscovery = {
        rigor: defContDiscRigor,
        contextualEndorsements: {
          score: {
            fire: defFireInterpScore,
            thumbUp: defThumbUpInterpScore,
            thumbDown: defThumbDownInterpScore,
          },
          confidence: defContextualEndorsementInterpCon,
        },
        wikiReactions: {
          likes: {
            score: defContextualWikiLikeInterpScore,
            confidence: defContextualWikiLikeInterpCon,
          },
          dislikes: {
            score: defContextualWikiDislikeInterpScore,
            confidence: defContextualWikiDislikeInterpCon,
          },
        },
      }
    },
    // Content Discovery
    updateContentDiscoveryRigor: (state, action) => {
      state.controlPanels.contentDiscovery.rigor = action.payload
    },
    // base layer of the grapevine
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
    addContextualEndorsement: (state, action) => {
      console.log('addContextualEndorsement')
      const event = action.payload.event
      const cid = action.payload.cid
      if (!state.contextualEndorsements) {
        state.contextualEndorsements = {}
      }
      if (!state.contextualEndorsements.byCid) {
        state.contextualEndorsements.byCid = {}
        state.contextualEndorsements.byContext = {}
      }
      const context = fetchFirstByTag('c',event)
      state.contextualEndorsements.byCid[cid] = event
      if (context) {
        if (!state.contextualEndorsements.byContext[context]) {
          state.contextualEndorsements.byContext[context] = []
        }
        if (!state.contextualEndorsements.byContext[context].includes(cid)) {
          state.contextualEndorsements.byContext[context].push(cid)
        }
      }
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
        contentDiscovery: {
          rigor: defContDiscRigor,
          contextualEndorsements: {
            score: {
              fire: defFireInterpScore,
              thumbUp: defThumbUpInterpScore,
              thumbDown: defThumbDownInterpScore,
            },
            confidence: defContextualEndorsementInterpCon,
          },
          wikiReactions: {
            likes: {
              score: defContextualWikiLikeInterpScore,
              confidence: defContextualWikiLikeInterpCon,
            },
            dislikes: {
              score: defContextualWikiDislikeInterpScore,
              confidence: defContextualWikiDislikeInterpCon,
            },
          },
        },
      }
      state.actions = {}
      state.categories = {}
      state.contexts = {}
      state.trustAttestations = {}
      state.contextualEndorsements = {}
      state.contextualEndorsements.byCid = {}
      state.contextualEndorsements.byContext = {}
    },
  },
})

export const {
  createContentDiscoveryControlPanel,
  updateContentDiscoveryRigor,
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
  addContextualEndorsement,
  wipeGrapevine,
} = grapevineSlice.actions

export default grapevineSlice.reducer
