import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nip19, validateEvent } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'
import { ndk } from '../ndk'
import { makeEventSerializable } from '..'
import { addContextualEndorsement } from '../../redux/features/grapevine/slice'

const ContentDiscoveryListener = () => {
  const dispatch = useDispatch()

  const filter = {
    kinds: [9902, 39902],
    '#w': ['contextualEndorsement'],
  }

  const sub7 = ndk.subscribe(filter)
  sub7.on('event', async (eventNS) => {
    // const author = eventNS.author
    // const profile = await author.fetchProfile()
    // console.log(`${profile.name}: ${eventNS.content}`)
    const event = makeEventSerializable(eventNS)
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
  })

  return <></>
}

export default ContentDiscoveryListener
