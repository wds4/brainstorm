import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const MakeNewAction = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Make New Action</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">Make a new actions</p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MakeNewAction
