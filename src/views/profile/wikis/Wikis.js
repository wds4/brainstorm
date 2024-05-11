import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { nip19 } from 'nostr-tools'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateViewWikifreediaTopic } from 'src/redux/features/siteNavigation/slice'
import { updateViewWikifreediaArticle } from '../../../redux/features/siteNavigation/slice'

const Wikis = ({ oProfile, npub, pubkey }) => {
  const [searchField, setSearchField] = useState('')
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oAuthors = useSelector((state) => state.wikifreedia.authors)

  let aTopicsRef = []
  if (oAuthors[pubkey]) {
    aTopicsRef = oAuthors[pubkey]
  }

  // ? TO DO: order topics alphabetically (or chronologically?)
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

  const processViewArticleClick = (naddr) => {
    dispatch(updateViewWikifreediaArticle(naddr))
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
                    if (!oAuthors) {
                      return (
                        <CTableRow key={item}>
                          <CTableDataCell scope="row">
                            <CNavLink
                              href="#/wikifreedia/singleEntry"
                            >
                              {topicSlug}
                            </CNavLink>
                          </CTableDataCell>
                          <CTableDataCell>error retrieving data</CTableDataCell>
                        </CTableRow>
                      )
                    }
                    if (oAuthors) {
                      const aAuthors = Object.keys(oAuthors)
                      const naddr = nip19.naddrEncode({
                        pubkey,
                        kind: 30818,
                        identifier: topicSlug,
                        relays: [],
                      })
                      return (
                        <CTableRow key={item}>
                          <CTableDataCell scope="row">
                            <CNavLink
                              href="#/wikifreedia/singleEntry"
                              onClick={() => processViewArticleClick(naddr)}
                            >
                              {topicSlug}
                            </CNavLink>
                          </CTableDataCell>
                          <CTableDataCell>{aAuthors.length}</CTableDataCell>
                        </CTableRow>
                      )
                    }
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
