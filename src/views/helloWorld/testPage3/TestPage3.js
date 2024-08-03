import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormTextarea,
} from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { validateEvent } from 'nostr-tools'
import { makeEventSerializable } from '../../../helpers'
import RawDataNostrEvent from './RawDataNostrEvent'

const oDefaultFilter = {
  kinds: [31890],
  limit: 200,
}
const TestPage3 = () => {
  const [filter, setFilter] = useState(JSON.stringify(oDefaultFilter, null, 4))
  const [oEvents, setOEvents] = useState({})

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }
  const processDownloadEventsCommand = () => {
    downloadEvents(filter)
  }

  const addEventToState = (event) => {
    oEvents[event.id] = event
    const obj = JSON.parse(JSON.stringify(oEvents))
    obj[event.id] = event
    setOEvents(obj)
  }

  // use ndk-react
  const { fetchEvents } = useNDK()

  const downloadEvents = async (filter) => {
    const events = await fetchEvents(JSON.parse(filter))
    events.forEach((eventNS, item) => {
      if (validateEvent(eventNS)) {
        const event = makeEventSerializable(eventNS)
        addEventToState(event)
      }
    })
  }

  return (
    <>
      <center>
        <h3>Test Page 3</h3>
      </center>
      <div></div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Provide filter and view notes.</strong>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormTextarea
                  label="filter"
                  type="text"
                  rows={7}
                  value={filter}
                  onChange={handleFilterChange}
                />
              </CForm>
              <br />
              <CButton color="primary" onClick={processDownloadEventsCommand}>
                Submit
              </CButton>
              <br /><br />
              <CRow>
                <div>events: {Object.keys(oEvents).length}</div>
              </CRow>
              <br />
              {Object.keys(oEvents).map((eventId, item) => {
                return (
                  <CRow key={item}>
                    <RawDataNostrEvent oEvent={oEvents[eventId]} item={item} />
                  </CRow>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default TestPage3
