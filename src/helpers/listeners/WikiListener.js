import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'

const WikiListenerMain = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const dispatch = useDispatch()

  const filter = {
    kinds: [30818],
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
            dispatch(addArticle(event))
          }
        } catch (e) {
          console.log('updateWikiDatabase error: ' + e)
        }
      })
    }
    updateWikiDatabase()
  }, [fetchEvents(filter)])

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
