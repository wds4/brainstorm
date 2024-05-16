import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle } from '../../redux/features/wikifreedia/slice'
import { makeEventSerializable } from '..'
import { listenerMethod } from '../../const'

const WikiListenerMain = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const dispatch = useDispatch()

  const filter = {
    kinds: [30818],
    since: 0,
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateWikifreediaDatabase() {
      const events = await fetchEvents(filter)

      events.forEach((eventNS, item) => {
        try {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)
            dispatch(addArticle(event))
          }
        } catch (e) {
          console.log('updateWikifreediaDatabase error: ' + e)
        }
      })
    }
    updateWikifreediaDatabase()
  }, [fetchEvents(filter)])

  return <></>
}

const WikiListener = () => {
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <WikiListenerMain />
  }
  return <></>
}

export default WikiListener
