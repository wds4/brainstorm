import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nip19, validateEvent } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { makeEventSerializable } from '..'
import { addContextualEndorsement } from '../../redux/features/grapevine/slice'

const ContentDiscoveryListener = () => {
  const dispatch = useDispatch()

  const filter = {
    kinds: [9902, 39902],
    '#w': ['contextualEndorsement'],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateLocalDatabase() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        if (validateEvent(eventNS)) {
          const event = makeEventSerializable(eventNS)
          try {
            const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
            if (aTags_w.length > 0) {
              let cid = event.id
              const wordType = aTags_w[0][1]
              if (event.kind >= 30000 && event.kind < 40000) {
                const tag_d = fetchFirstByTag('d', event)
                const naddr = nip19.naddrEncode({
                  pubkey: event.pubkey,
                  kind: event.kind,
                  identifier: tag_d,
                  relays: [],
                })
                cid = naddr
              }
              if (wordType == 'contextualEndorsement') {
                dispatch(addContextualEndorsement({ event, cid }))
              }
            }
          } catch (e) {
            console.log('updateLocalDatabase error: ' + e)
          }
        }
      })
    }
    updateLocalDatabase()
  }, [fetchEvents(filter)])

  return <></>
}

export default ContentDiscoveryListener
