import React from 'react'
import { CCol, CRow } from '@coreui/react'

const GeneralSettings = () => {
  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
      <CRow>
        <CCol xs={12}>
          <div>? to do:</div>
          <li>option to toggle nostr listener on / off (test if affects website performance)</li>
        </CCol>
      </CRow>
    </>
  )
}

export default GeneralSettings
