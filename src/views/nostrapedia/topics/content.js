import React, { useCallback, useEffect, useState } from 'react'
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
import {
  updateSortWikiTopicsBy,
  updateViewNostrapediaTopic,
} from '../../../redux/features/siteNavigation/slice'
import { whenTopicWasLastUpdated } from '../singleTopic/SingleTopic'
import { secsToTime } from '../../../helpers'

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

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [numVersionsColumnClassName, setNumVersionsColumnClassName] = useState('show') // show or hide

  const dispatch = useDispatch()

  useEffect(() => {
    try {
      function initSortTopicsBy() {
        updateSortBySelector(currentSortTopicsBy)
        if (currentSortTopicsBy == 'numerical') {
          setNumVersionsColumnClassName('show')
          setLastUpdateColumnClassName('hide')
        }
        if (currentSortTopicsBy == 'chronological') {
          setNumVersionsColumnClassName('hide')
          setLastUpdateColumnClassName('show')
        }
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
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
    }
    if (newSortByValue == 'reverseAlphabetical') {
      const aFoo = aTopicsFiltered.sort().reverse()
      setATopicsFiltered(aFoo)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
    }
    if (newSortByValue == 'numerical') {
      const aFoo = aTopicsFiltered
      const aTopicObjects = []
      aFoo.forEach((topic) => {
        const numberOfVersions = Object.keys(oWikiArticles_byDTag[topic]).length
        aTopicObjects.push({ topic, numberOfVersions })
      })
      const aTopicObjectsOrdered = aTopicObjects.sort(
        (a, b) => parseFloat(b.numberOfVersions) - parseFloat(a.numberOfVersions),
      )
      const aTopicsOrdered = []
      aTopicObjectsOrdered.forEach((obj, item) => {
        aTopicsOrdered.push(obj.topic)
      })
      setATopicsFiltered(aTopicsOrdered)
      setNumVersionsColumnClassName('show')
      setLastUpdateColumnClassName('hide')
    }
    if (newSortByValue == 'chronological') {
      // const aFoo = Object.keys(oWikiArticles_byDTag)
      const aFoo = aTopicsFiltered
      const aTopicObjects = []
      aFoo.forEach((topic) => {
        const mostRecentUpdate = whenTopicWasLastUpdated(
          oWikiArticles_byNaddr,
          oWikiArticles_byDTag,
          topic,
        )
        aTopicObjects.push({ topic, mostRecentUpdate })
      })
      const aTopicObjectsOrdered = aTopicObjects.sort(
        (a, b) => parseFloat(b.mostRecentUpdate) - parseFloat(a.mostRecentUpdate),
      )
      const aTopicsOrdered = []
      aTopicObjectsOrdered.forEach((obj, item) => {
        aTopicsOrdered.push(obj.topic)
      })
      setATopicsFiltered(aTopicsOrdered)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('show')
    }
  }

  const handleSortByChange = useCallback(
    (newSortByValue) => {
      sortFilteredTopics(newSortByValue, aTopicsFiltered)
    },
    [sortBy, aTopicsFiltered],
  )

  const processDTagClick = (dTag) => {
    dispatch(updateViewNostrapediaTopic(dTag))
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
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flexGrow: '1' }}>
                  <strong>showing {aTopicsFiltered.length} Topics</strong>
                </div>
                <div style={{ flexGrow: 'auto' }}>
                  <strong>
                    {aTopicsRef.length} topics, {Object.keys(oWikiArticles_byNaddr).length} articles
                    in total
                  </strong>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block' }}>
                  <CFormSelect
                    value={sortBy}
                    onChange={(e) => {
                      updateSortBySelector(e.target.value)
                    }}
                    id="sortBySelector"
                    options={[
                      { label: 'alphabetical', value: 'alphabetical' },
                      { label: 'reverse alphabetical', value: 'reverseAlphabetical' },
                      { label: '# of versions', value: 'numerical' },
                      { label: 'most recent', value: 'chronological' },
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
                    <CTableHeaderCell scope="col">topic</CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={lastUpdateColumnClassName}
                    >
                      last update
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={numVersionsColumnClassName}
                    >
                      # authors
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aTopicsFiltered.map((topicSlug, item) => {
                    const oAuthors = oWikiArticles_byDTag[topicSlug]
                    let aAuthors = []
                    if (oAuthors) {
                      aAuthors = Object.keys(oAuthors)
                    }
                    const whenLastUpdated = whenTopicWasLastUpdated(
                      oWikiArticles_byNaddr,
                      oWikiArticles_byDTag,
                      topicSlug,
                    )
                    const howLongAgo = secsToTime(whenLastUpdated)
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <CNavLink
                            href="#/nostrapedia/singleTopic"
                            onClick={() => processDTagClick(topicSlug)}
                          >
                            {topicSlug}
                          </CNavLink>
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={lastUpdateColumnClassName}
                        >
                          {howLongAgo}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={numVersionsColumnClassName}
                        >
                          {aAuthors.length}
                        </CTableDataCell>
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
