import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent } from 'nostr-tools'
import { processKind1Event } from '../../redux/features/twittr/slice'
import { makeEventSerializable } from '..'
import { listenerMethod } from '../../const'

// TO DO: test
// eslint-disable-next-line react/prop-types
const TwittrListenerMain = ({ aPubkeys }) => {
  const dispatch = useDispatch()

  const filter = {
    kinds: [1],
    authors: aPubkeys,
    since: 0,
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateTwittrDatabase() {
      const events = await fetchEvents(filter)

      events.forEach((eventNS, item) => {
        try {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)
            dispatch(processKind1Event(event))
          }
        } catch (e) {
          console.log('updateTwittrDatabase error: ' + e)
        }
      })
    }
    updateTwittrDatabase()
  }, [fetchEvents(filter)])

  return <><div>TwittrListener</div></>
}

const TwittrListener = () => {
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <TwittrListenerMain />
  }
  return <></>
}

export default TwittrListener
