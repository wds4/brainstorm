import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle, addKind7Rating } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'

const WikiLikesListenerMain = () => {
  const oArticles = useSelector((state) => state.nostrapedia.articles.byEventId)
  let aArticleIds = []
  if (oArticles) {
    aArticleIds = Object.keys(oArticles)
  }
  const dispatch = useDispatch()

  const filter = {
    kinds: [7],
    '#e': aArticleIds,
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateWikiDatabase() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        try {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)
            const pubkey = event.pubkey
            // console.log('WikiLikesListenerMain; event: ' + JSON.stringify(event, null, 4))
            dispatch(addNewPubkey(pubkey))
            dispatch(addKind7Rating(event))
          }
        } catch (e) {
          console.log('updateWikiLikesDatabase error: ' + e)
        }
      })
    }
    updateWikiDatabase()
  }, [fetchEvents(filter)])

  return <></>

  return (
    <>
      <div>Wiki Likes Listener</div>
      <div>aArticleIds.length: {aArticleIds.length}</div>
    </>
  )
}

const WikiLikesListener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod == 'off') {
    return <></>
  }
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <WikiLikesListenerMain />
  }
  return <></>
}

export default WikiLikesListener
