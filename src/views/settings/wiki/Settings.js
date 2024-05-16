import { CCol, CRow } from '@coreui/react'
import React from 'react'

const WikifreediaSettings = () => {
  return (
    <>
      <center>
        <h4>Wiki Settings</h4>
      </center>
      <CRow>
        <CCol xs={12}>
          <div>? to do:</div>
          <li>toggle editor page: e.g. shows if you have any suggested edits which you can accept / reject</li>
        </CCol>
      </CRow>
    </>
  )
}

export default WikifreediaSettings
