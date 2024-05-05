import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addAction, addCategory, addContext } from 'src/redux/features/grapevine/slice'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { addTrustAttestation } from '../../../redux/features/grapevine/slice'
import { cutoffTime } from '../../../const'

const GrapevineListener = () => {
  const dispatch = useDispatch()

  const filter = {
    kinds: [9902, 37069, 39902],
    since: cutoffTime,
    '#P': ['tapestry'],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateGrapevineDatabase() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        try {
          const event = eventNS.rawEvent()
          let aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
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
            if (wordType == 'action') {
              dispatch(addAction({ event, cid }))
            }
            if (wordType == 'category') {
              dispatch(addCategory({ event, cid }))
            }
            if (wordType == 'context') {
              // console.log('updateGrapevineDatabase; context; cid: ' + cid)
              dispatch(addContext({ event, cid }))
            }
            if (wordType == 'trustAttestation') {
              dispatch(addTrustAttestation({ event, cid }))
            }
            if (wordType == 'nestedList') {
              console.log('fetchEvents_nestedList')
            }
          }
        } catch (e) {
          console.log('updateGrapevineDatabase error: ' + e)
        }
      })
    }
    updateGrapevineDatabase()
  }, [fetchEvents(filter)])

  return <></>
}

export default GrapevineListener
