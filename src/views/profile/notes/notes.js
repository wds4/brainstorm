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

  const dispatch = useDispatch()
  const { fetchEvents } = useNDK()

  const since = 0
  const filter = {
    authors: [pubkey],
    since,
    kinds: [1],
  }

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
        events.forEach((eventNS) => {
          if (validateEvent(eventNS)) {
            const event = {}
            event.id = eventNS.id
            event.content = eventNS.content
            event.kind = eventNS.kind
            event.tags = eventNS.tags
            event.created_at = eventNS.created_at
            event.pubkey = eventNS.pubkey
            event.sig = eventNS.sig
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
            {aCompositeIdentifiers.map((compositeIdentifier, item) => {
              return <TwittrNote key={item} event={oKind1Events[compositeIdentifier]} />
            })}
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Notes
