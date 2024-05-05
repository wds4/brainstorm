import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CListGroup } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'

const ViewSingleContext = () => {
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const viewContextId = useSelector((state) => state.siteNavigation.viewContextId)
  const oContextEvent = oContexts[viewContextId]
  const contextName = fetchFirstByTag('name', oContextEvent)
  const contextDescription = fetchFirstByTag('description', oContextEvent)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{contextName}</strong>
          </CCardHeader>
          <CCardBody>
            <div>viewContextId: {viewContextId}</div>
            <large>{contextDescription}</large>
            <CListGroup>
              <pre>{JSON.stringify(oContextEvent, null, 4)}</pre>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewSingleContext
