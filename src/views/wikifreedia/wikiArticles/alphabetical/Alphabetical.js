import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
import { updateViewWikifreediaTopic } from '../../../../redux/features/siteNavigation/slice'

const WikiArticlesAlphabetical = () => {
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState('alphabetical')
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  const aTopics = Object.keys(oWikiArticles_byDTag).sort()
  const [aTopicsFiltered, setATopicsFiltered] = useState(aTopics)

  const dispatch = useDispatch()

  const handleSearchFieldChange = useCallback(
    async (e) => {
      const newField = e.target.value
      setSearchField(newField)
      const newArray = []
      aTopics.forEach((t) => {
        if (t.includes(newField)) {
          newArray.push(t)
        }
      })
      setATopicsFiltered(newArray)
    },
    [searchField],
  )

  const processDTagClick = (dTag) => {
    console.log('processDTagClick dTag: ' + dTag)
    dispatch(updateViewWikifreediaTopic(dTag))
  }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>
                {aTopics.length} Topics, {Object.keys(oWikiArticles_byNaddr).length} articles
              </strong>
            </CCardHeader>
            <CCardBody>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block' }}>
                  <CFormSelect
                    value={sortBy}
                    aria-label="Default select example"
                    options={[
                      'Open this select menu',
                      { label: 'alphabetical', value: 'alphabetical' },
                      { label: 'most recent update', value: 'chronological' },
                      { label: 'WoT score', value: 'wetScore', disabled: true },
                    ]}
                  ></CFormSelect>
                </div>
              </div>
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
    </>
  )
}

export default WikiArticlesAlphabetical
