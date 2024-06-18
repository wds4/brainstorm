import React, { useCallback, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CFormSwitch, CRow } from '@coreui/react'
import { fetchFirstByTag } from 'src/helpers'

const RawData = ({ showRawDataButton, oEvent, label }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>{label}</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
        </CCardBody>
      </CCard>
    </>
  )
}
// eslint-disable-next-line react/prop-types
const RawDataNostrEvent = ({ oEvent, item }) => {
  const content = oEvent.content
  const tag_client = fetchFirstByTag('client', oEvent)
  const tag_k = fetchFirstByTag('k', oEvent)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const toggleShowRawData = useCallback(
    (e) => {
      if (showRawDataButton == 'hide') {
        setShowRawDataButton('show')
      }
      if (showRawDataButton == 'show') {
        setShowRawDataButton('hide')
      }
    },
    [showRawDataButton],
  )
  return (
    <>
      <div>
        <div style={{ display: 'inline-block', width: '50px' }}>
          <CFormSwitch label={item} onChange={(e) => toggleShowRawData(e)} id="formSwitchCheckDefault" />
        </div>
        <div style={{ display: 'inline-block', marginLeft: '30px', width: '25px' }}>{content}</div>
        <div style={{ display: 'inline-block', marginLeft: '30px', width: '100px' }}>{tag_client}</div>
        <div style={{ display: 'inline-block', marginLeft: '30px' }}>{tag_k}</div>
      </div>
      <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} label={oEvent.id} />
    </>
  )
}

export default RawDataNostrEvent
