import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ndk } from '../ndk'
import { validateEvent } from 'nostr-tools'
import { processKind1Event } from '../../redux/features/twittr/slice'
import { makeEventSerializable } from '..'

// TO DO: test
// eslint-disable-next-line react/prop-types
const TwittrListenerMain = ({ aPubkeys }) => {
  const dispatch = useDispatch()

  const filter = {
    kinds: [1],
    authors: aPubkeys,
  }

  const sub9 = ndk.subscribe(filter)
  sub9.on('event', async (eventNS) => {
    // const author = eventNS.author
    // const profile = await author.fetchProfile()
    // console.log(`${profile.name}: ${eventNS.content}`)
    const event = makeEventSerializable(eventNS)
    dispatch(processKind1Event(event))
  })

  return <><div>TwittrListener</div></>
}

const TwittrListener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod == 'off') {
    return <></>
  }
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <TwittrListenerMain />
  }
  return <></>
}

export default TwittrListener
