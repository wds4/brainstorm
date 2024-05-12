import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle } from '../../redux/features/wikifreedia/slice'

// TO DO: test
const TwittrListener = ({aPubkeys}) => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const dispatch = useDispatch()

  const filter = {
    kinds: [1],
    authors: aPubkeys,
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
            const event = {}
            event.id = eventNS.id
            event.kind = eventNS.kind
            event.content = eventNS.content
            event.tags = eventNS.tags
            event.created_at = eventNS.created_at
            event.pubkey = eventNS.pubkey
            event.sig = eventNS.sig
            dispatch(addArticle(event))
            // EXPERIMENTAL:
            // Incorporate each entry into the Concept Graph store.
            // (Not yet implemented.)
          }
        } catch (e) {
          console.log('updateWikifreediaDatabase error: ' + e)
        }
      })
    }
    updateWikifreediaDatabase()
  }, [])

  return <></>
}

export default TwittrListener
