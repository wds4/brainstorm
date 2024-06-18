import { createSlice } from '@reduxjs/toolkit'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'

export const nostrapediaSlice = createSlice({
  name: 'nostrapedia',
  initialState: {
    kind7Ratings: {
      byKind7EventId: {},
      byArticleEventId: {},
    }, // likes and dislikes
    articles: {
      byEventId: {}, // used as a lookup to avoid repeat processing of the same event multiple times
      byNaddr: {},
      byDTag: {},
    },
    authors: {}, // <pubkey>: array of topicSlugs
    categories: {},
  },
  reducers: {
    removeKind7EventId: (state, action) => {
      const kind7EventId = action.payload
      console.log('NEED TO REMOVE!! kind7EventId: ' + kind7EventId)
      if (state.kind7Ratings.byKind7EventId[kind7EventId]) {
        console.log('removeKind7EventId EVENT FOUND')
        const oKind7Event = state.kind7Ratings.byKind7EventId[kind7EventId]
        delete state.kind7Ratings.byKind7EventId[kind7EventId]
        const content = oKind7Event.content
        const tag_e = fetchFirstByTag('e', oKind7Event)
        if (state.kind7Ratings.byArticleEventId[tag_e]) {
          if (content == '+') {
            if (state.kind7Ratings.byArticleEventId[tag_e].likes.includes(kind7EventId)) {
              console.log('NEED TO REMOVE FROM LIKES!! kind7EventId: ' + kind7EventId)
              const aOld = JSON.parse(
                JSON.stringify(state.kind7Ratings.byArticleEventId[tag_e].likes),
              )
              const aUpdated = []
              aOld.forEach((eid) => {
                if (eid != kind7EventId) {
                  aUpdated.push(eid)
                }
              })
              state.kind7Ratings.byArticleEventId[tag_e].likes = aUpdated
            }
          }
          if (content == '-') {
            if (state.kind7Ratings.byArticleEventId[tag_e].dislikes.includes(kind7EventId)) {
              console.log('NEED TO REMOVE FROM DISLIKES!! kind7EventId: ' + kind7EventId)
              const aOld = JSON.parse(
                JSON.stringify(state.kind7Ratings.byArticleEventId[tag_e].dislikes),
              )
              const aUpdated = []
              aOld.forEach((eid) => {
                if (eid != kind7EventId) {
                  aUpdated.push(eid)
                }
              })
              state.kind7Ratings.byArticleEventId[tag_e].dislikes = aUpdated
            }
          }
          // TO DO: process emojis like thumbUp, thumbDown, etc
        }
      }
    },
    addArticle: (state, action) => {
      const oEvent = action.payload
      if (!Object.keys(state.articles.byEventId).includes(oEvent.id)) {
        // byEventId
        state.articles.byEventId[oEvent.id] = oEvent
        const pubkey = oEvent.pubkey
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
          /*
          if (!state.articles.byDTag[topic]) {
            state.articles.byDTag[topic] = {}
            state.articles.byDTag[topic].mostRecentUpdate = 0
            state.articles.byDTag[topic].byPubkey = {}
          }
          state.articles.byDTag[topic].byPubkey[oEvent.pubkey] = naddr
          if (state.articles.byDTag[topic].mostRecentUpdate < oEvent.created_at) {
            state.articles.byDTag[topic].mostRecentUpdate = oEvent.created_at
          }
          */
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
      }
    },
    addCategory: (state, action) => {
      const oEvent = action.payload.oEvent
      state.categories[oEvent.id] = oEvent
    },
    addKind7Rating: (state, action) => {
      const oEvent = action.payload
      if (!state.kind7Ratings) {
        state.kind7Ratings = {}
        state.kind7Ratings.byKind7EventId = {}
        state.kind7Ratings.byArticleEventId = {}
      }
      if (!state.kind7Ratings.byKind7EventId[oEvent.id]) {
        state.kind7Ratings.byKind7EventId[oEvent.id] = oEvent
        const content = oEvent.content
        const tag_a = fetchFirstByTag('a', oEvent)
        const tag_e = fetchFirstByTag('e', oEvent)
        const tag_p = fetchFirstByTag('p', oEvent)
        const tag_client = fetchFirstByTag('client', oEvent)
        if (!state.kind7Ratings.byArticleEventId[tag_e]) {
          state.kind7Ratings.byArticleEventId[tag_e] = {}
          state.kind7Ratings.byArticleEventId[tag_e].likes = []
          state.kind7Ratings.byArticleEventId[tag_e].dislikes = []
        }
        // TO DO: accomodate emojis, e.g. if content == 💯 💜 🧡 👀 😂 🤙 ❤️ 🚀  🫂 🔥 🙏🏼 ♥️ ❤️‍🔥
        if (content == '+' || content == '👍') {
          if (!state.kind7Ratings.byArticleEventId[tag_e].likes.includes(oEvent.id)) {
            state.kind7Ratings.byArticleEventId[tag_e].likes.push(oEvent.id)
          }
        }
        if (content == '-' || content == '👎') {
          if (!state.kind7Ratings.byArticleEventId[tag_e].dislikes.includes(oEvent.id)) {
            state.kind7Ratings.byArticleEventId[tag_e].dislikes.push(oEvent.id)
          }
        }
      }
      /*
      kind7Ratings: {
        byKind7EventId: {
          <kind7EventId>: oEvent
        },
        byArticleEventId: {
          <articleEventId>: {
            likes: [<kind7EventId1>, <kind7EventId2>, ...],
            dislikes: [<kind7EventId1>, <kind7EventId2>, ...],
          }
        },
      }
      */
    },
    wipeNostrapedia: (state, action) => {
      state.kind7Ratings = {}
      state.kind7Ratings.byKind7EventId = {}
      state.kind7Ratings.byArticleEventId = {}
      state.articles = {}
      state.articles.byEventId = {}
      state.articles.byNaddr = {}
      state.articles.byDTag = {}
      state.authors = {}
      state.categories = {}
    },
  },
})

export const { removeKind7EventId, addArticle, addCategory, addKind7Rating, wipeNostrapedia } =
  nostrapediaSlice.actions

export default nostrapediaSlice.reducer
