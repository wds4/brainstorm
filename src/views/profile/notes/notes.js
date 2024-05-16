import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TwittrNote from 'src/views/twittr/components/twittrNote'
import { CCol, CContainer, CRow } from '@coreui/react'

const Notes = ({ oProfile, pubkey }) => {
  const [aCompositeIdentifiers, setACompositeIdentifiers] = useState([])
  const oKind1Events = useSelector((state) => state.twittr.mainFeed.events)
  const oEventsByAuthor = useSelector((state) => state.twittr.mainFeed.eventsByAuthor)

  useEffect(() => {
    async function updateEvents() {
      if (pubkey && oEventsByAuthor[pubkey]) {
        setACompositeIdentifiers(oEventsByAuthor[pubkey])
      }
    }
    updateEvents()
  }, [oEventsByAuthor])

  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <center>
              <h3>Notes by this user</h3>
            </center>
            <div style={{ maxHeight: '600px', overflow: 'scroll' }}>
              {aCompositeIdentifiers.map((compositeIdentifier, item) => {
                return <TwittrNote key={item} event={oKind1Events[compositeIdentifier]} />
              })}
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Notes
