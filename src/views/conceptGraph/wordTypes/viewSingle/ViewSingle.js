import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CListGroup } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'

const ViewSingleWordType = () => {
  const oWords = useSelector((state) => state.conceptGraph.words)
  const viewWordCid = useSelector((state) => state.siteNavigation.conceptGraph.viewWordType)
  const oWordEvent = oWords[viewWordCid]
  const sWord = fetchFirstByTag('word', oWordEvent)
  const oWord = JSON.parse(sWord)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{viewWordCid}</strong>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              <pre>{JSON.stringify(oWord, null, 4)}</pre>
              <pre>{JSON.stringify(oWordEvent, null, 4)}</pre>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewSingleWordType
