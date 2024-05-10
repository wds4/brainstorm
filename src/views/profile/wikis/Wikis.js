import { cilClone } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateViewWikifreediaTopic } from '../../../redux/features/siteNavigation/slice'

const Wikis = ({ oProfile, npub, pubkey }) => {
  const [searchField, setSearchField] = useState('')
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oAuthors = useSelector((state) => state.wikifreedia.authors)
  const aTopicsRef = oAuthors[pubkey].sort()
  const [aTopicsFiltered, setATopicsFiltered] = useState(aTopicsRef)

  const dispatch = useDispatch()

  const handleSearchFieldChange = useCallback(
    async (e) => {
      const newField = e.target.value
      setSearchField(newField)
      const newArray = []
      aTopicsRef.forEach((t) => {
        if (t.includes(newField)) {
          newArray.push(t)
        }
      })
      setATopicsFiltered(newArray)
    },
    [searchField, aTopicsFiltered],
  )

  const processDTagClick = (dTag) => {
    dispatch(updateViewWikifreediaTopic(dTag))
  }

  return (
    <CContainer
      className="px-4"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}
    >
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>
                This user has written articles on {aTopicsFiltered.length} Topics.
              </strong>
            </CCardHeader>
            <CCardBody>
              <CFormInput
                label="search by topic:"
                type="text"
                value={searchField}
                onChange={handleSearchFieldChange}
              />
              <br />
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      topics ({aTopicsFiltered.length})
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col"># authors</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aTopicsFiltered.map((topicSlug, item) => {
                    const oAuthors = oWikiArticles_byDTag[topicSlug]
                    const aAuthors = Object.keys(oAuthors)
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <CNavLink
                            href="#/wikifreedia/singleTopic"
                            onClick={() => processDTagClick(topicSlug)}
                          >
                            {topicSlug}
                          </CNavLink>
                        </CTableDataCell>
                        <CTableDataCell>{aAuthors.length}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Wikis
