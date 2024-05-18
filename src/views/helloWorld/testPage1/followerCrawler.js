import { validateEvent } from 'nostr-tools'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeEventSerializable } from '../../../helpers'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { processKind3Event, updateKind0Event } from '../../../redux/features/profiles/slice'

const FollowerCrawler = ({ aPubkeysWithoutKind3Event, crawlerState }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aProfilesByNpub = Object.keys(oProfilesByNpub)
  const dispatch = useDispatch()

  const filter = {
    kinds: [0, 3],
    // authors: aPubkeysWithoutKind3Event,
  }

  const { fetchEvents } = useNDK()

  useEffect(() => {
    async function updateDatabase() {
      if (crawlerState == 'on') {
        console.log('updateDatabase start')
        const events = await fetchEvents(filter)
        console.log('updateDatabase; events: ' + events.length)
        events.forEach((eventNS, item) => {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)
            if (event.kind == 0) {
              dispatch(updateKind0Event(event))
            }
            if (event.kind == 3) {
              dispatch(processKind3Event(event))
            }
          }
        })
      }
    }
    updateDatabase()
  }, [filter])

  return (
    <>
      <div style={{ border: '1px solid orange', borderRadius: '5px', padding: '5px' }}>
        <center>Follower Crawler</center>
        <div>aProfilesByNpub.length: {aProfilesByNpub.length}</div>
        <div>aPubkeysWithoutKind3Event.length: {aPubkeysWithoutKind3Event.length}</div>
        <pre>filter: {JSON.stringify(filter, null, 4)}</pre>
      </div>
    </>
  )
}

export default FollowerCrawler
