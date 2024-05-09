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
    categories: {},
  },
  reducers: {
    addArticle: (state, action) => {
      const event = action.payload.event
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
      const naddr = nip19.naddrEncode({
        pubkey: oEvent.pubkey,
        kind: oEvent.kind,
        identifier: topic,
        relays: [],
      })
      state.articles.byNaddr[naddr] = oEvent
      // const tag_title = fetchFirstByTag('title', oEvent)
      // const tag_published_at = fetchFirstByTag('published_at', oEvent)
      if (topic) {
        if (!state.articles.byDTag[topic]) {
          state.articles.byDTag[topic] = {}
        }
        state.articles.byDTag[topic][oEvent.pubkey] = naddr
      }
      // process category
      const category = fetchFirstByTag('c', oEvent)
      console.log('wikifreediaSlice category: ' + category)
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
      state.categories = {}
      console.log('wipeWikifreedia!!')
    },
  },
})

export const { addArticle, addCategory, wipeWikifreedia } = wikifreediaSlice.actions

export default wikifreediaSlice.reducer
