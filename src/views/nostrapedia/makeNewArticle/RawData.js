import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import React from 'react'

const RawData = ({ showRawDataButton, oEvent, naddr }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw nostr event</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
          <div>naddr: {naddr}</div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default RawData
