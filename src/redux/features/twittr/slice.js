import { createSlice } from '@reduxjs/toolkit'

export const twittrSlice = createSlice({
  name: 'twittr',
  initialState: {
    mainFeed: {
      events: {}, // <eventID>: oEvent, in no particular order
      eventsByAuthor: {}, // <pubkey>: [], an array of compositeIdentifiers
      aCompositeIdentifiers: [], // array of compositeIdentifiers: created_at + '_' + eventID of the note
    },
  },
  reducers: {
    processKind1Event: (state, action) => {
      const event = action.payload
      const eventID = event.id
      const created_at = event.created_at
      const compositeIdentifier = created_at + '_' + eventID // compositeIdentifier is easy to order chronoligically; the eventID ensures each event is represented only once
      state.mainFeed.events[compositeIdentifier] = event.rawEvent()
      // now update eventsByAuthor
      if (!state.mainFeed.eventsByAuthor[event.pubkey]) {
        state.mainFeed.eventsByAuthor[event.pubkey] = []
      }
      if (!state.mainFeed.eventsByAuthor[event.pubkey].includes(compositeIdentifier)) {
        state.mainFeed.eventsByAuthor[event.pubkey].push(compositeIdentifier)
      }
    },
    wipeTwittr: (state, action) => {
      state.mainFeed = {
        events: {},
        eventsByAuthor: {},
        aCompositeIdentifiers: [],
      }
    },
  },
})

export const { processKind1Event, wipeTwittr } = twittrSlice.actions

export default twittrSlice.reducer
