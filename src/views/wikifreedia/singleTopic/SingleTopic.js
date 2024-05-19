import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CListGroup,
  CFormSwitch,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CNavLink,
  CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { ListEvent } from './ListEvent'
import { fetchFirstByTag } from 'src/helpers'
import Markdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom'
import { updateViewWikifreediaTopic } from 'src/redux/features/siteNavigation/slice'
import { nip19 } from 'nostr-tools'
import { ShowAuthor } from '../components/ShowAuthor'
import {
  updateSortSingleTopicBy,
  updateViewWikifreediaArticle,
} from '../../../redux/features/siteNavigation/slice'
import { secsToTime } from '../../../helpers'
import {
  getProfileBrainstormFromNpub,
  getProfileBrainstormFromPubkey,
} from '../../../helpers/brainstorm'
import { ShowAuthorImageOnly } from '../components/ShowAuthorImageOnly'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'

export const whenTopicWasLastUpdated = (oEvents, oTopicSlugs, topicSlug) => {
  if (!topicSlug) {
    return 0
  }
  let mostRecentUpdate = 0
  const oEventsByPubkey = oTopicSlugs[topicSlug]
  if (!oEventsByPubkey) {
    return 0
  }
  const aPubkeys = Object.keys(oEventsByPubkey)
  aPubkeys.forEach((pk, item) => {
    const naddr = oEventsByPubkey[pk]
    const oEvent = oEvents[naddr]
    mostRecentUpdate = Math.max(mostRecentUpdate, oEvent.created_at)
  })
  return mostRecentUpdate
}

const RawData = ({ showRawDataButton, oEvent, naddr }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw nostr event</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
          <div>naddr: {naddr}</div>
        </CCardBody>
      </CCard>
    </>
  )
}

const WikiTopic = () => {
  const myFollows = useSelector((state) => state.profile.kind3.follows)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const currentSortSingleTopicBy = useSelector(
    (state) => state.siteNavigation.wikifreedia.sortSingleTopicBy,
  )
  const [sortBy, setSortBy] = useState(currentSortSingleTopicBy)

  const [searchParams, setSearchParams] = useSearchParams()
  const viewTopic = useSelector((state) => state.siteNavigation.wikifreedia.viewTopic)
  const [topicSlug, setTopicSlug] = useState(viewTopic)
  const oTopicSlugs = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oEvents = useSelector((state) => state.wikifreedia.articles.byNaddr)
  let oAuthors = {}
  let aAuthorsRef = []
  if (oTopicSlugs[topicSlug]) {
    oAuthors = oTopicSlugs[topicSlug]
    aAuthorsRef = Object.keys(oAuthors)
  }
  const [aAuthorsSorted, setAAuthorsSorted] = useState(aAuthorsRef)
  const mostRecentUpdate = whenTopicWasLastUpdated(oEvents, oTopicSlugs, topicSlug)

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [dosScoreColumnClassName, setDosScoreColumnClassName] = useState('show') // show or hide
  const [coracleWotScoreColumnClassName, setCoracleWotScoreColumnClassName] = useState('show') // show or hide

  const [coracleWotScore, setCoracleWotScore] = useState({}) // show or hide

  const dispatch = useDispatch()

  const makeNpubLookupFromPubkey = () => {
    const oOutput1 = {}
    const oOutput2 = {}
    aAuthorsRef.forEach((pk) => {
      const np = nip19.npubEncode(pk)
      oOutput1[pk] = np
      let wotScore = 0
      let refFollowers = []
      if (oProfilesByNpub[np] && oProfilesByNpub[np].followers) {
        refFollowers = oProfilesByNpub[np].followers
      }
      refFollowers.forEach((refPubkey, item) => {
        if (myFollows.includes(refPubkey)) {
          wotScore++
        }
      })
      oOutput2[pk] = wotScore
    })
    setCoracleWotScore(oOutput2)
  }

  useEffect(() => {
    function updateTopicFromUrl() {
      const topicFromUrl = searchParams.get('topic')
      if (topicFromUrl) {
        dispatch(updateViewWikifreediaTopic(topicFromUrl))
        setTopicSlug(topicFromUrl)
      }
    }
    updateTopicFromUrl()
    makeNpubLookupFromPubkey()
  }, [topicSlug])

  let showVersions = 'There are ' + aAuthorsRef.length + ' versions of this article.'
  if (aAuthorsRef.length == 1) {
    showVersions = 'There is ' + aAuthorsRef.length + ' version of this article.'
  }

  const processViewArticleClick = (naddr) => {
    dispatch(updateViewWikifreediaArticle(naddr))
  }

  const getTimeOfPublication = (pk) => {
    const naddr = oAuthors[pk]
    const oEvent = oEvents[naddr]
    let published_at = fetchFirstByTag('published_at', oEvent)
    if (!published_at) {
      published_at = oEvent.created_at
    }
    return published_at
  }

  const sortItems = useCallback(
    (sortByMethod) => {
      if (sortByMethod == 'chronological') {
        console.log('chronological')
        const arraySorted = aAuthorsRef.sort(
          (a, b) => getTimeOfPublication(b) - getTimeOfPublication(a),
        )
        setLastUpdateColumnClassName('show')
        setDosScoreColumnClassName('hide')
        setCoracleWotScoreColumnClassName('hide')
        return arraySorted
      }
      if (sortByMethod == 'wotScore') {
        console.log('wotScore')
        const arraySorted = aAuthorsRef.sort((a, b) => coracleWotScore[b] - coracleWotScore[a])
        setLastUpdateColumnClassName('hide')
        setDosScoreColumnClassName('hide')
        setCoracleWotScoreColumnClassName('show')
        return arraySorted
      }
      if (sortByMethod == 'degreesOfSeparation') {
        console.log('degreesOfSeparation')
        setLastUpdateColumnClassName('hide')
        setDosScoreColumnClassName('show')
        setCoracleWotScoreColumnClassName('hide')
        const arraySorted = aAuthorsRef.sort(
          (a, b) =>
            getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.degreesOfSeparation -
            getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.degreesOfSeparation,
        )
        return arraySorted
      }
    },
    [sortBy],
  )

  useEffect(() => {
    try {
      sortItems(sortBy)
    } catch (e) {}
  }, [])

  const updateSortBySelector = useCallback(
    (newSortByValue) => {
      setSortBy(newSortByValue)
      dispatch(updateSortSingleTopicBy(newSortByValue))
      setAAuthorsSorted(sortItems(newSortByValue))
    },
    [sortBy],
  )
  return (
    <>
      <center>
        <h1>
          <strong>{topicSlug}</strong>
        </h1>
      </center>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="row">
                <div className="col">
                  <small>{showVersions}</small>
                </div>
                <div className="col-auto">
                  <div style={{ display: 'inline-block'}}>
                    <CFormSelect
                      value={sortBy}
                      onChange={(e) => {
                        updateSortBySelector(e.target.value)
                      }}
                      id="sortBySelector"
                      options={[
                        { label: 'most recent', value: 'chronological' },
                        { label: 'degrees of separation', value: 'degreesOfSeparation' },
                        { label: 'WoT score', value: 'wotScore' },
                        { label: 'Influence Score', value: 'influenceScore', disabled: true },
                      ]}
                    ></CFormSelect>
                  </div>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>
                      author
                    </CTableHeaderCell>
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
                      className={coracleWotScoreColumnClassName}
                    >
                      WoT score
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={dosScoreColumnClassName}
                    >
                      degrees of separation
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>
                      link
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aAuthorsSorted.map((pk, item) => {
                    const naddr = oAuthors[pk]
                    const npub = nip19.npubEncode(pk)
                    const oEvent = oEvents[naddr]
                    let published_at = fetchFirstByTag('published_at', oEvent)
                    if (!published_at) {
                      published_at = oEvent.created_at
                    }
                    const displayTime = secsToTime(published_at)
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <ShowAuthorBrainstormProfileImageOnly npub={npub} />
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={lastUpdateColumnClassName}
                        >
                          {displayTime}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={coracleWotScoreColumnClassName}
                        >
                          {coracleWotScore[pk]}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={dosScoreColumnClassName}
                        >
                          {
                            getProfileBrainstormFromNpub(npub, oProfilesByNpub).wotScores
                              .degreesOfSeparation
                          }
                        </CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>
                          <CButton color="primary">
                            <CNavLink
                              href="#/wikifreedia/singleEntry"
                              onClick={() => processViewArticleClick(naddr)}
                            >
                              View Article
                            </CNavLink>
                          </CButton>
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

export default WikiTopic
