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
import { updateViewWord } from 'src/redux/features/siteNavigation/slice'

const ViewAllWords = () => {
  const viewWord = useSelector((state) => state.siteNavigation.conceptGraph.viewWord)
  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const oWords = oConceptGraph.words

  const dispatch = useDispatch()

  const processWordClick = (cid) => {
    dispatch(updateViewWord(cid))
  }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <div>viewWord: {viewWord}</div>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{Object.keys(oWords).length} Words</strong>
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
                  {Object.keys(oWords).map((cid, item) => {
                    const event = oWords[cid]
                    const pk = event.pubkey
                    const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
                    let wT = ''
                    if (aTags_w.length > 0) {
                      wT = aTags_w[0][1]
                    }
                    return (
                      <CTableRow key={cid}>
                        <CTableHeaderCell scope="row">
                          <CNavLink
                            href="#/conceptGraph/words/viewSingle"
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

export default ViewAllWords
