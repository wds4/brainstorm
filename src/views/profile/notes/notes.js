import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { processKind1Event } from 'src/redux/features/twittr/slice'
import TwittrNote from 'src/views/twittr/components/twittrNote'
import { CCol, CContainer, CRow } from '@coreui/react'

const Notes = ({ oProfile, pubkey }) => {
  const [aCompositeIdentifiers, setACompositeIdentifiers] = useState([])
  const oKind1Events = useSelector((state) => state.twittr.mainFeed.events)
  const oEventsByAuthor = useSelector((state) => state.twittr.mainFeed.eventsByAuthor)
  /*
  let aCompositeIdentifiers = []
  if (oEventsByAuthor[pubkey]) {
    aCompositeIdentifiers = oEventsByAuthor[pubkey]
  }
  // const aCompositeIdentifiers = Object.keys(oKind1Events)
  aCompositeIdentifiers.sort().reverse()
  */

  const dispatch = useDispatch()
  const { fetchEvents } = useNDK()

  const currentTime = Math.floor(Date.now() / 1000)
  // const since = currentTime - 24 * 60 * 60 * 1 // since one day ago
  const since = 0
  const filter = {
    authors: [pubkey],
    since,
    kinds: [1],
  }

  // filter.since = currentTime - ( (24 * 60 * 60 * days) + (60 * 60 * hours) + (60 * minutes) )

  useEffect(() => {
    async function updateEvents() {
      if (pubkey && oEventsByAuthor[pubkey]) {
        setACompositeIdentifiers(oEventsByAuthor[pubkey])
      }
    }
    updateEvents()
  }, [oEventsByAuthor])

  useEffect(() => {
    async function updateEvents() {
      if (pubkey) {
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

      <CContainer>
        <CRow>
          <CCol>
            <center>
              <h3>Notes by this user</h3>
            </center>
            {aCompositeIdentifiers.map((compositeIdentifier) => {
              return (
                <>
                  <TwittrNote event={oKind1Events[compositeIdentifier]} />
                </>
              )
            })}
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Notes
