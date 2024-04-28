import { useNDK } from '@nostr-dev-kit/ndk-react'
import { useNostrEvents } from 'nostr-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAction, addCategory, addContext } from '../../redux/features/grapevine/slice'

const GrapevineDashboard = () => {
  const oActions = useSelector((state) => state.grapevine.actions)
  const oCategories = useSelector((state) => state.grapevine.categories)
  const oContexts = useSelector((state) => state.grapevine.contexts)

  const dispatch = useDispatch()

  const filter = {
    since: [0],
    kinds: [9902, 39902],
    '#P': ['tapestry'],
  }

  // use nostr-react
  const { events } = useNostrEvents({
    filter: filter,
  })
  events.sort((a, b) => parseFloat(b.created_at) - parseFloat(a.created_at))
  events.forEach(async (event, item) => {
    let aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
    if (aTags_w.length > 0) {
      const wordType = aTags_w[0][1]
      if (wordType == 'action') {
        dispatch(addAction(event))
      }
      if (wordType == 'category') {
        dispatch(addCategory(event))
      }
      if (wordType == 'context') {
        dispatch(addContext(event))
      }
    }
  })

  /*
  // use ndk-react
  const { fetchEvents, NDKEvent } = useNDK()
  useEffect(() => {
    async function updateContextData() {
      const events = await fetchEvents(filter)
      console.log('events.length: ' + events.length + '; typeof events: ' + typeof events)
      events.forEach((event, item) => {
        let aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
        if (aTags_w.length > 0) {
          const createdAt = event.created_at
          console.log('typeof event: ' + typeof event)
          console.log('number of keys: ' + Object.keys(event).length)
          Object.keys(event).forEach((key, k) => {
            console.log('key: ' + key)
          })
          console.log('updateContextData; event.id: ' + event.id)
          console.log('updateContextData; event.content: ' + event.content)
          console.log('updateContextData; event.word: ' + event.word)
          console.log('updateContextData; event.tags: ' + JSON.stringify(event.tags, null, 4))
          const wordType = aTags_w[0][1]
          console.log('wordType: ' + wordType)
          if (wordType == 'action') {
            dispatch(addAction(event))
          }
          if (wordType == 'category') {
            dispatch(addCategory(event))
          }
          if (wordType == 'context') {
            dispatch(addContext(event))
          }
        }
      })
    }
    updateContextData()
  }, [])
  */

  return (
    <>
      <center>
        <h3>Grapevine Dashboard</h3>
      </center>
      <div>stored in redux:</div>
      <div>number of actions: {Object.keys(oActions).length}</div>
      <div>number of categories: {Object.keys(oCategories).length}</div>
      <div>number of contexts: {Object.keys(oContexts).length}</div>
    </>
  )
}

export default GrapevineDashboard
