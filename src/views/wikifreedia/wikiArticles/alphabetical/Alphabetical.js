import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
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
import { updateSortWikiTopicsBy, updateViewWikifreediaTopic } from '../../../../redux/features/siteNavigation/slice'
import { whenTopicWasLastUpdated } from '../../singleTopic/SingleTopic'
import { secsToTime, secsToTimeAgo } from '../../../../helpers'

const WikiArticlesAlphabetical = () => {
  const currentSortTopicsBy = useSelector((state) => state.siteNavigation.wikifreedia.sortTopicsBy)
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState(currentSortTopicsBy)
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  let aTopicsRef = []
  if (Object.keys(oWikiArticles_byDTag)) {
    aTopicsRef = Object.keys(oWikiArticles_byDTag).sort()
  }
  const [aTopicsFiltered, setATopicsFiltered] = useState(aTopicsRef)

  const dispatch = useDispatch()

  useEffect(() => {
    try {
      function initSortTopicsBy() {
        updateSortBySelector(currentSortTopicsBy)
      }
      initSortTopicsBy()
    } catch (e) {}
  }, [])

  // TO DO: merge sort and filter into a single function

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
    [searchField, aTopicsFiltered, sortBy],
  )

  const sortFilteredTopics = (newSortByValue, aTopicsFiltered) => {
    if (newSortByValue == 'alphabetical') {
      const aFoo = aTopicsFiltered.sort()
      setATopicsFiltered(aFoo)
    }
    if (newSortByValue == 'reverseAlphabetical') {
      const aFoo = aTopicsFiltered.sort().reverse()
      setATopicsFiltered(aFoo)
    }
    if (newSortByValue == 'numerical') {
      const aFoo = aTopicsFiltered
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
      // const aFoo = Object.keys(oWikiArticles_byDTag)
      const aFoo = aTopicsFiltered
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
  }

  const handleSortByChange = useCallback(
    (newSortByValue) => {
      sortFilteredTopics(newSortByValue, aTopicsFiltered)
    },
    [sortBy, aTopicsFiltered],
  )

  const processDTagClick = (dTag) => {
    dispatch(updateViewWikifreediaTopic(dTag))
  }

  const updateSortBySelector = (newSortByValue) => {
    setSortBy(newSortByValue)
    handleSortByChange(newSortByValue)
    dispatch(updateSortWikiTopicsBy(newSortByValue))
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
                    onChange={(e)=>{updateSortBySelector(e.target.value)}}
                    id="sortBySelector"
                    options={[
                      { label: 'alphabetical', value: 'alphabetical' },
                      { label: 'reverse alphabetical', value: 'reverseAlphabetical' },
                      { label: '# of versions', value: 'numerical' },
                      { label: 'most recent update', value: 'chronological' },
                      { label: 'WoT score', value: 'wotScore', disabled: true },
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
                    <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>last update</CTableHeaderCell>
                    <CTableHeaderCell scope="col"># authors</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aTopicsFiltered.map((topicSlug, item) => {
                    const oAuthors = oWikiArticles_byDTag[topicSlug]
                    let aAuthors = []
                    if (oAuthors) {
                      aAuthors = Object.keys(oAuthors)
                    }
                    const whenLastUpdated = whenTopicWasLastUpdated(oWikiArticles_byNaddr, oWikiArticles_byDTag, topicSlug)
                    const howLongAgo = secsToTime(whenLastUpdated)
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
                        <CTableDataCell style={{ textAlign: 'right' }}>{howLongAgo}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{aAuthors.length}</CTableDataCell>
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
