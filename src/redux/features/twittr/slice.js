import { createSlice } from '@reduxjs/toolkit'

export const twittrSlice = createSlice({
  name: 'twittr',
  initialState: {
    mainFeed: {
      events: {}, // <eventID>: oEvent, in no particular order
      aCompositeIdentifiers: [], // array of compositeIdentifiers
    },
  },
  reducers: {
    processKind1Event: (state, action) => {
      const event = action.payload
      const eventID = event.id
      const created_at = event.created_at
      const compositeIdentifier = created_at + '_' + eventID // compositeIdentifier is easy to order chronoligically; the eventID ensures each event is represented only once
      state.mainFeed.events[compositeIdentifier] = event.rawEvent()
    },
    wipeTwittr: (state, action) => {
      state.mainFeed = {
        events: {},
        aCompositeIdentifiers: [],
      }
    },
  },
})

export const { processKind1Event, wipeTwittr } = twittrSlice.actions

export default twittrSlice.reducer
