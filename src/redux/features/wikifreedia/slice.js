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
      const tag_d = fetchFirstByTag('d', oEvent)
      const naddr = nip19.naddrEncode({
        pubkey: oEvent.pubkey,
        kind: oEvent.kind,
        identifier: tag_d,
        relays: [],
      })
      state.articles.byNaddr[naddr] = oEvent
      const tag_title = fetchFirstByTag('title', oEvent)
      const tag_published_at = fetchFirstByTag('published_at', oEvent)
      if (tag_d) {
        if (!state.articles.byDTag[tag_d]) {
          state.articles.byDTag[tag_d] = {}
        }
        state.articles.byDTag[tag_d][oEvent.pubkey] = naddr
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
