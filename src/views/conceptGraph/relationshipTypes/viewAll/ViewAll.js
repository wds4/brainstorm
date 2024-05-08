import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { updateViewRelationshipType } from 'src/redux/features/siteNavigation/slice'

const ViewAllRelationshipTypes = () => {
  const viewRelationshipType = useSelector((state) => state.siteNavigation.conceptGraph.viewRelationshipType)
  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const aRelationshipTypes = oConceptGraph.byWordType.relationshipType
  const oWords = oConceptGraph.words

  const dispatch = useDispatch()

  const processWordClick = (cid) => {
    dispatch(updateViewRelationshipType(cid))
  }
  return (
    <>
      <center>
        <h3>View All Relationship Types</h3>
      </center>
      <div>{aRelationshipTypes.length} aRelationshipTypes</div>
      <CRow>
        <CCol xs={12}>
          <div>viewRelationshipType: {viewRelationshipType}</div>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{aRelationshipTypes.length} Relationship Types</strong>
            </CCardHeader>
            <CCardBody>
              <CTable small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Word Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">cid</CTableHeaderCell>
                    <CTableHeaderCell scope="col">pubkey</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aRelationshipTypes.map((cid, item) => {
                    const event = oWords[cid]
                    const pk = event.pubkey
                    const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
                    let wT = ''
                    if (aTags_w.length > 0) {
                      wT = aTags_w[0][1]
                    }
                    if (wT == 'relationshipType') {
                      return (
                        <CTableRow key={cid}>
                          <CTableHeaderCell scope="row">
                            <CNavLink
                              href="#/conceptGraph/relationshipTypes/viewSingle"
                              onClick={() => processWordClick(cid)}
                            >
                              {item}
                            </CNavLink>
                          </CTableHeaderCell>
                          <CTableDataCell>{wT}</CTableDataCell>
                          <CTableDataCell>{cid}</CTableDataCell>
                          <CTableDataCell>{pk}</CTableDataCell>
                        </CTableRow>
                      )
                    }
                    return <></>
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ViewAllRelationshipTypes
