import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'
import { safeDecode } from '../nip19'

const WikiNaddrListener = ({ naddr }) => {
  const dispatch = useDispatch()
  const decodedNaddr = safeDecode(naddr)

  let filter = {
    kinds: [30818],
  }

  if (decodedNaddr.type == 'naddr') {
    filter = {
      kinds: [30818],
      '#d': [decodedNaddr.data.identifier],
    }
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
            dispatch(addNewPubkey(pubkey))
            dispatch(addArticle(event))
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
    updateWikiDatabase()
  }, [fetchEvents(filter)])

  return (
    <>
      <div>fetching {naddr} ...</div>
      <div>(refresh this page if article doesn't load in a timely manner)</div>
    </>
  )
}

export default WikiNaddrListener
