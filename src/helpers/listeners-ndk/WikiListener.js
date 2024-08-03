import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ndk } from '../ndk'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'

const WikiListenerMain = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const dispatch = useDispatch()

  const filter = {
    kinds: [30818],
  }

  const sub11 = ndk.subscribe(filter)
  sub11.on('event', async (eventNS) => {
    // const author = eventNS.author
    // const profile = await author.fetchProfile()
    // console.log(`${profile.name}: ${eventNS.content}`)
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addArticle(event))
  })

  return <></>
}

const WikiListener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod == 'off') {
    return <></>
  }
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <WikiListenerMain />
  }
  return <></>
}

export default WikiListener
