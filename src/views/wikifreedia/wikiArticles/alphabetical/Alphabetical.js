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
import { updateViewWikifreediaTopic } from '../../../../redux/features/siteNavigation/slice'

const WikiArticlesAlphabetical = () => {
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)

  const aDTags = Object.keys(oWikiArticles_byDTag).sort()

  const dispatch = useDispatch()

  const processDTagClick = (dTag) => {
    console.log('processDTagClick dTag: ' + dTag)
    dispatch(updateViewWikifreediaTopic(dTag))
  }
  return (
    <>
      <center>
        <h3>Wiki Articles: Alphabetically</h3>
      </center>
      <div>number of wiki articles by dTag: {Object.keys(oWikiArticles_byDTag).length}</div>
      <div>number of wiki articles by eventId: {Object.keys(oWikiArticles_byNaddr).length}</div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{aDTags.length} topics (d-tags)</strong>
            </CCardHeader>
            <CCardBody>
              <CTable small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">topic</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aDTags.map((dTag, item) => {
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell>{item}</CTableDataCell>
                        <CTableHeaderCell scope="row">
                          <CNavLink
                            href="#/wikifreedia/singleTopic"
                            onClick={() => processDTagClick(dTag)}
                          >
                            {dTag}
                          </CNavLink>
                        </CTableHeaderCell>
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

export default WikiArticlesAlphabetical
