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
import { updateViewWordType } from 'src/redux/features/siteNavigation/slice'

const ViewAllWordTypes = () => {
  const viewWordType = useSelector((state) => state.siteNavigation.conceptGraph.viewWordType)
  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const aWordTypes = oConceptGraph.byWordType.wordType
  const oWords = oConceptGraph.words

  const dispatch = useDispatch()

  const processWordClick = (cid) => {
    dispatch(updateViewWordType(cid))
  }
  return (
    <>
      <center>
        <h3>View All Word Types</h3>
      </center>
      <div>{aWordTypes.length} aWordTypes</div>
      <CRow>
        <CCol xs={12}>
          <div>viewWordType: {viewWordType}</div>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{aWordTypes.length} Words</strong>
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
                  {aWordTypes.map((cid, item) => {
                    const event = oWords[cid]
                    const pk = event.pubkey
                    const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
                    let wT = ''
                    if (aTags_w.length > 0) {
                      wT = aTags_w[0][1]
                    }
                    if (wT == 'wordType') {
                      return (
                        <CTableRow key={cid}>
                          <CTableHeaderCell scope="row">
                            <CNavLink
                              href="#/conceptGraph/wordTypes/viewSingle"
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

export default ViewAllWordTypes
