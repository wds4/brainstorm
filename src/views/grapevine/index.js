import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const GrapevineDashboard = () => {
  const oActions = useSelector((state) => state.grapevine.actions)
  const oCategories = useSelector((state) => state.grapevine.categories)
  const oContexts = useSelector((state) => state.grapevine.contexts)

  const { fetchEvents } = useNDK()

  const filter = {
    since: [0],
    kinds: [9902],
    '#P': ['tapestry'],
  }

  useEffect(() => {
    async function updateContextData() {
      const events = await fetchEvents(filter)
      events.forEach((event, item) => {
        let aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
        const createdAt = event.created_at
        console.log(event)
        console.log('updateContextData; event.id: ' + event.id)
        console.log('updateContextData; event.content: ' + event.content)
        console.log('updateContextData; event.word: ' + event.word)
        console.log('updateContextData; event.tags: ' + JSON.stringify(event.tags, null, 4))
      })
    }
    updateContextData()
  }, [fetchEvents(filter)])

  return (
    <>
      <center>
        <h3>Grapevine Dashboard</h3>
      </center>
      <div>number of actions: {Object.keys(oActions).length}</div>
      <div>number of categories: {Object.keys(oCategories).length}</div>
      <div>number of contexts: {Object.keys(oContexts).length}</div>
    </>
  )
}

export default GrapevineDashboard
