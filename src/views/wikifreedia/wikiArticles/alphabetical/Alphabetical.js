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
import { whenTopicWasLastUpdated } from '../../singleTopic/SingleTopic'

const WikiArticlesAlphabetical = () => {
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState('alphabetical')
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  let aTopicsRef = []
  if (Object.keys(oWikiArticles_byDTag)) {
    aTopicsRef = Object.keys(oWikiArticles_byDTag).sort()
  }
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

  const handleSortByChange = useCallback(
    (newSortByValue) => {
      if (newSortByValue == 'alphabetical') {
        const aFoo = Object.keys(oWikiArticles_byDTag).sort()
        setATopicsFiltered(aFoo)
      }
      if (newSortByValue == 'reverseAlphabetical') {
        const aFoo = Object.keys(oWikiArticles_byDTag).sort().reverse()
        setATopicsFiltered(aFoo)
      }
      if (newSortByValue == 'numerical') {
        const aFoo = Object.keys(oWikiArticles_byDTag)
        const aTopicObjects = []
        aFoo.forEach((topic) => {
          const numberOfVersions = Object.keys(oWikiArticles_byDTag[topic]).length
          aTopicObjects.push({topic, numberOfVersions})
        })
        const aTopicObjectsOrdered = aTopicObjects.sort((a,b) => parseFloat(b.numberOfVersions) - parseFloat(a.numberOfVersions))
        const aTopicsOrdered = []
        aTopicObjectsOrdered.forEach((obj, item) => {
          aTopicsOrdered.push(obj.topic)
        })
        setATopicsFiltered(aTopicsOrdered)
      }
      if (newSortByValue == 'chronological') {
        const aFoo = Object.keys(oWikiArticles_byDTag)
        const aTopicObjects = []
        aFoo.forEach((topic) => {
          const mostRecentUpdate = whenTopicWasLastUpdated(oWikiArticles_byNaddr, oWikiArticles_byDTag, topic)
          aTopicObjects.push({topic, mostRecentUpdate})
        })
        const aTopicObjectsOrdered = aTopicObjects.sort((a,b) => parseFloat(b.mostRecentUpdate) - parseFloat(a.mostRecentUpdate))
        const aTopicsOrdered = []
        aTopicObjectsOrdered.forEach((obj, item) => {
          aTopicsOrdered.push(obj.topic)
        })
        setATopicsFiltered(aTopicsOrdered)
      }
    },
    [sortBy, aTopicsFiltered],
  )

  const processDTagClick = (dTag) => {
    dispatch(updateViewWikifreediaTopic(dTag))
  }

  const updateSortBySelector = (e) => {
    const newSortByValue = e.target.value
    setSortBy(newSortByValue)
    handleSortByChange(newSortByValue)
  }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>
                {aTopicsFiltered.length} Topics, {Object.keys(oWikiArticles_byNaddr).length} articles
              </strong>
            </CCardHeader>
            <CCardBody>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block' }}>
                  <CFormSelect
                    value={sortBy}
                    onChange={(e)=>{updateSortBySelector(e)}}
                    id="sortBySelector"
                    options={[
                      { label: 'alphabetical', value: 'alphabetical' },
                      { label: 'reverse alphabetical', value: 'reverseAlphabetical' },
                      { label: '# of versions', value: 'numerical' },
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
