import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { processKind1Event } from 'src/redux/features/twittr/slice'
import TwittrNote from 'src/views/twittr/components/twittrNote'
import { CContainer } from '@coreui/react'

const MainFeed = () => {
  const aFollows = useSelector((state) => state.profile.kind3.follows)
  const oKind1Events = useSelector((state) => state.twittr.mainFeed.events)

  const aCompositeIdentifiers = Object.keys(oKind1Events)
  aCompositeIdentifiers.sort().reverse()

  const dispatch = useDispatch()
  const { fetchEvents } = useNDK()

  const currentTime = Math.floor(Date.now() / 1000)
  // const since = currentTime - 24 * 60 * 60 * 1 // since one day ago
  const since = 0
  const filter = {
    authors: aFollows,
    since,
    kinds: [1],
  }

  // filter.since = currentTime - ( (24 * 60 * 60 * days) + (60 * 60 * hours) + (60 * minutes) )

  useEffect(() => {
    async function updateEvents() {
      if (aFollows) {
        const events = await fetchEvents(filter)
        events.forEach((event) => {
          if (validateEvent(event)) {
            dispatch(processKind1Event(event))
          }
        })
      }
    }
    updateEvents()
  }, [fetchEvents(filter)])
  return (
    <>
      <center>
        <h3>Twittr Main Feed</h3>
      </center>
      <CContainer>
        {aCompositeIdentifiers.map((compositeIdentifier) => {
          return (
            <>
              <TwittrNote event={oKind1Events[compositeIdentifier]} />
            </>
          )
        })}
      </CContainer>
    </>
  )
}

export default MainFeed

