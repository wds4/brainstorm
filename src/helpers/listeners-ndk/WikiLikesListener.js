import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ndk } from '../ndk'
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

  const sub10 = ndk.subscribe(filter)
  sub10.on('event', async (eventNS) => {
    // const author = eventNS.author
    // const profile = await author.fetchProfile()
    // console.log(`${profile.name}: ${eventNS.content}`)
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addKind7Rating(event))
  })

  return <></>
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
