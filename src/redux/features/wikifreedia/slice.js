import { createSlice } from '@reduxjs/toolkit'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'

export const wikifreediaSlice = createSlice({
  name: 'wikifreedia',
  initialState: {
    articles: {
      byNaddr: {},
      byDTag: {},
    },
    authors: {}, // <pubkey>: array of topicSlugs
    categories: {},
  },
  reducers: {
    addArticle: (state, action) => {
      const event = action.payload.event
      const pubkey = event.pubkey
      // or use event.rawEvent() ?
      const oEvent = {
        id: event.id,
        kind: event.kind,
        content: event?.content,
        tags: event?.tags,
        pubkey: event?.pubkey,
        created_at: event?.created_at,
        sig: event?.sig,
      }
      const topic = fetchFirstByTag('d', oEvent)

      // byNaddr
      const naddr = nip19.naddrEncode({
        pubkey: oEvent.pubkey,
        kind: oEvent.kind,
        identifier: topic,
        relays: [],
      })
      state.articles.byNaddr[naddr] = oEvent

      // authors
      if (!state.authors[pubkey]) {
        state.authors[pubkey] = []
      }
      if (!state.authors[pubkey].includes(topic)) {
        state.authors[pubkey].push(topic)
      }

      // byDTag
      if (topic) {
        if (!state.articles.byDTag[topic]) {
          state.articles.byDTag[topic] = {}
        }
        state.articles.byDTag[topic][oEvent.pubkey] = naddr
      }
      // process category
      const category = fetchFirstByTag('c', oEvent)
      if (category) {
        if (!state.categories[category]) {
          state.categories[category] = {}
        }
        if (topic) {
          if (!state.categories[category][topic]) {
            state.categories[category][topic] = []
          }
          if (!state.categories[category][topic].includes(naddr)) {
            state.categories[category][topic].push(naddr)
          }
        }
      }
    },
    addCategory: (state, action) => {
      const oEvent = action.payload.oEvent
      state.categories[oEvent.id] = oEvent
    },
    wipeWikifreedia: (state, action) => {
      state.articles = {}
      state.articles.byNaddr = {}
      state.articles.byDTag = {}
      state.authors = {}
      state.categories = {}
    },
  },
})

export const { addArticle, addCategory, wipeWikifreedia } = wikifreediaSlice.actions

export default wikifreediaSlice.reducer
