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
import { updateViewNostrapediaTopic } from 'src/redux/features/siteNavigation/slice'
import { nip19, validateEvent } from 'nostr-tools'
import { ShowAuthor } from '../components/ShowAuthor'
import {
  updateApp,
  updateSortTopicBy,
  updateViewNostrapediaArticle,
} from '../../../redux/features/siteNavigation/slice'
import { secsToTime } from '../../../helpers'
import {
  getProfileBrainstormFromNpub,
  getProfileBrainstormFromPubkey,
} from '../../../helpers/brainstorm'
import { ShowAuthorImageOnly } from '../components/ShowAuthorImageOnly'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

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
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const currentSortTopicBy = useSelector((state) => state.siteNavigation.wikifreedia.sortTopicBy)
  const [sortBy, setSortBy] = useState('category')
  const signedIn = useSelector((state) => state.profile.signedIn)
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

  const oScoreUpdates = useSelector((state) => state.settings.grapevine.scoreUpdates)
  let whenInfluenceScoresUpdated = 0
  if (oScoreUpdates && oScoreUpdates.influenceScore) {
    whenInfluenceScoresUpdated = oScoreUpdates.influenceScore.timestamp
  }
  let whenWotScoresUpdated = 0
  if (oScoreUpdates && oScoreUpdates.wotScore) {
    whenWotScoresUpdated = oScoreUpdates.wotScore.timestamp
  }
  let whenDosScoresUpdated = 0
  if (oScoreUpdates && oScoreUpdates.degreesOfSeparation) {
    whenDosScoresUpdated = oScoreUpdates.degreesOfSeparation.timestamp
  }

  const myNpub = useSelector((state) => state.profile.npub)
  let aMyFollows = []
  if (myNpub && oProfilesByNpub && oProfilesByNpub[myNpub]) {
    aMyFollows = useSelector((state) => oProfilesByNpub[myNpub].follows)
  }

  const [promptLoginElemClassName, setPromptLoginElemClassName] = useState('hide') // show or hide
  const [promptFollowForWotUtilityClassName, setPromptFollowForWotUtilityClassName] =
    useState('hide') // show or hide
  const [promptFollowForDosUtilityClassName, setPromptFollowForDosUtilityClassName] =
    useState('hide') // show or hide
  const [promptFollowForInfluenceUtilityClassName, setPromptFollowForInfluenceUtilityClassName] =
    useState('hide') // show or hide
  const [promptCalcInfluenceScoreElemClassName, setPromptCalcInfluenceScoreElemClassName] =
    useState('hide') // show or hide
  const [promptCalcDosScoreElemClassName, setPromptCalcDosScoreElemClassName] =
    useState('hide') // show or hide
  const [promptCalcWotScoreElemClassName, setPromptCalcWotScoreElemClassName] =
    useState('hide') // show or hide
  const [promptNeedMoreFollowsDataClassName, setPromptNeedMoreFollowsDataClassName] =
    useState('hide') // show or hide

  const [aAuthorsSorted, setAAuthorsSorted] = useState(aAuthorsRef)
  const mostRecentUpdate = whenTopicWasLastUpdated(oEvents, oTopicSlugs, topicSlug)

  const [aCategories, setACategories] = useState([])

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [dosScoreColumnClassName, setDosScoreColumnClassName] = useState('show') // show or hide
  const [coracleWotScoreColumnClassName, setCoracleWotScoreColumnClassName] = useState('show') // show or hide
  const [influenceScoreColumnClassName, setInfluenceScoreColumnClassName] = useState('show') // show or hide
  const [categoryColumnClassName, setCategoryColumnClassName] = useState('show') // show or hide

  const dispatch = useDispatch()

  const calculateWotScores = () => {
    const oWotScoresLookup = {}
    aAuthorsRef.forEach((pk) => {
      const np = nip19.npubEncode(pk)
      let wotScore = 0
      let refFollowers = []
      if (oProfilesByNpub[np] && oProfilesByNpub[np].followers) {
        refFollowers = oProfilesByNpub[np].followers
      }
      refFollowers.forEach((refPubkey, item) => {
        if (aMyFollows.includes(refPubkey)) {
          wotScore++
        }
      })
      oWotScoresLookup[pk] = wotScore
    })
    return oWotScoresLookup
  }

  const coracleWotScore = calculateWotScores()

  let showVersions = 'There are ' + aAuthorsRef.length + ' versions of this article.'
  if (aAuthorsRef.length == 1) {
    showVersions = 'There is ' + aAuthorsRef.length + ' version of this article.'
  }

  const processViewArticleClick = (naddr) => {
    dispatch(updateViewNostrapediaArticle(naddr))
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
        const arraySorted = aAuthorsRef.sort(
          (a, b) => getTimeOfPublication(b) - getTimeOfPublication(a),
        )
        setLastUpdateColumnClassName('show')
        setDosScoreColumnClassName('hide')
        setCoracleWotScoreColumnClassName('hide')
        setInfluenceScoreColumnClassName('hide')
        setCategoryColumnClassName('hide')
        return arraySorted
      }
      if (sortByMethod == 'wotScore') {
        if (!signedIn) {
          setPromptLoginElemClassName('show')
        }
        if (signedIn && aMyFollows.length == 0) {
          setPromptFollowForWotUtilityClassName('show')
        }
        if (signedIn && aOneHop.length > 0 && aTwoHops == 0) {
          setPromptNeedMoreFollowsDataClassName('show')
        } else {
          if (!whenWotScoresUpdated) {
            if (signedIn) {
              // setPromptCalcWotScoreElemClassName('show')
            }
          }
        }
        const arraySorted = aAuthorsRef.sort((a, b) => {
          return coracleWotScore[b] - coracleWotScore[a]
        })
        setLastUpdateColumnClassName('hide')
        setDosScoreColumnClassName('hide')
        setCoracleWotScoreColumnClassName('show')
        setInfluenceScoreColumnClassName('hide')
        setCategoryColumnClassName('hide')
        return arraySorted
      }
      if (sortByMethod == 'degreesOfSeparation') {
        if (!signedIn) {
          setPromptLoginElemClassName('show')
        }
        if (signedIn && aMyFollows.length == 0) {
          setPromptFollowForDosUtilityClassName('show')
        }
        if (signedIn && aOneHop.length > 0 && aTwoHops == 0) {
          setPromptNeedMoreFollowsDataClassName('show')
        } else {
          if (!whenDosScoresUpdated) {
            if (signedIn) {
              setPromptCalcDosScoreElemClassName('show')
            }
          }
        }
        setLastUpdateColumnClassName('hide')
        setDosScoreColumnClassName('show')
        setCoracleWotScoreColumnClassName('hide')
        setInfluenceScoreColumnClassName('hide')
        setCategoryColumnClassName('hide')
        const arraySorted = aAuthorsRef.sort((a, b) => {
          const fooA = Number(
            getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.degreesOfSeparation,
          )
          const fooB = Number(
            getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.degreesOfSeparation,
          )
          return fooA - fooB
        })
        return arraySorted
      }
      if (sortByMethod == 'influenceScore') {
        if (!signedIn) {
          setPromptLoginElemClassName('show')
        }
        if (signedIn && aMyFollows.length == 0) {
          setPromptFollowForInfluenceUtilityClassName('show')
        }
        if (signedIn && aOneHop.length > 0 && aTwoHops == 0) {
          setPromptNeedMoreFollowsDataClassName('show')
        } else {
          if (!whenInfluenceScoresUpdated) {
            if (signedIn) {
              setPromptCalcInfluenceScoreElemClassName('show')
            }
          }
        }
        // const arraySorted = aAuthorsRef.sort((a, b) => coracleWotScore[b] - coracleWotScore[a])
        setLastUpdateColumnClassName('hide')
        setDosScoreColumnClassName('hide')
        setCoracleWotScoreColumnClassName('hide')
        setInfluenceScoreColumnClassName('show')
        setCategoryColumnClassName('hide')
        const arraySorted = aAuthorsRef.sort((a, b) => {
          const fooB = getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores
            .baselineInfluence.influence
          const fooA = getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores
            .baselineInfluence.influence
          const diff = Math.round(10000 * fooB) - Math.round(10000 * fooA)
          return diff
        })
        return arraySorted
      }
      if (sortByMethod == 'category') {
        // const arraySorted = aAuthorsRef.sort((a, b) => coracleWotScore[b] - coracleWotScore[a])
        setLastUpdateColumnClassName('hide')
        setDosScoreColumnClassName('hide')
        setCoracleWotScoreColumnClassName('hide')
        setInfluenceScoreColumnClassName('hide')
        setCategoryColumnClassName('show)')
        const arraySorted = JSON.parse(JSON.stringify(aAuthorsRef))
        return arraySorted
      }
    },
    [sortBy],
  )

  const updateSortBySelector = useCallback(
    (newSortByValue) => {
      setSortBy(newSortByValue)
      dispatch(updateSortTopicBy(newSortByValue))
      setAAuthorsSorted(sortItems(newSortByValue))
    },
    [sortBy],
  )

  const updateCategoryList = useCallback(() => {
    const aCategories_temp = []
    aAuthorsRef.forEach((pk, item) => {
      const naddr = oAuthors[pk]
      const oEvent = oEvents[naddr]
      let category = fetchFirstByTag('c', oEvent)
      if (category) {
        if (!aCategories_temp.includes(category)) {
          aCategories_temp.push(category)
        }
      }
      setACategories(aCategories_temp)
    })
  }, [])

  useEffect(() => {
    function updateTopicFromUrl() {
      const topicFromUrl = searchParams.get('topic')
      if (topicFromUrl) {
        dispatch(updateViewNostrapediaTopic(topicFromUrl))
        setTopicSlug(topicFromUrl)
      }
    }
    updateTopicFromUrl()
    setAAuthorsSorted(sortItems(sortBy))
    updateCategoryList()
  }, [topicSlug])

  const aOptions = [
    { label: 'category', value: 'category' },
    { label: 'most recent', value: 'chronological' },
    { label: 'degrees of separation', value: 'degreesOfSeparation' },
    { label: 'WoT score', value: 'wotScore' },
    { label: 'Influence Score', value: 'influenceScore' },
  ]
  aCategories.forEach((cat, item) => {
    const label = 'Influence Score (for category: ' + cat + ')'
    const oEntry = {
      label,
      value: 'influenceScoreByCategory',
      disabled: true,
    }
    aOptions.push(oEntry)
  })

  const oMyProfile = oProfilesByNpub[myNpub]
  let aOneHop = []
  let aTwoHops = []
  let aMoreHops = []
  let aDisconnected = []
  if (oMyProfile) {
    aOneHop = oMyProfile.follows
  }

  const aProfilesWithKnownFollows = []
  Object.keys(oProfilesByNpub).forEach((np) => {
    if (oProfilesByNpub[np].follows && oProfilesByNpub[np].follows.length > 0) {
      aProfilesWithKnownFollows.push(np)
    }
    if (
      oProfilesByNpub[np] &&
      oProfilesByNpub[np].wotScores &&
      oProfilesByNpub[np].wotScores.degreesOfSeparation
    ) {
      const dos = oProfilesByNpub[np].wotScores.degreesOfSeparation
      if (dos == 2) {
        if (!aTwoHops.includes(np)) {
          aTwoHops.push(np)
        }
      }
      if (dos > 2 && dos < 100) {
        if (!aMoreHops.includes(np)) {
          aMoreHops.push(np)
        }
      }
      if (dos > 100) {
        if (!aDisconnected.includes(np)) {
          aDisconnected.push(np)
        }
      }
    }
  })

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
                  <div style={{ display: 'inline-block' }}>
                    <CFormSelect
                      value={sortBy}
                      onChange={(e) => {
                        updateSortBySelector(e.target.value)
                      }}
                      id="sortBySelector"
                      options={aOptions}
                    ></CFormSelect>
                  </div>
                </div>
                <div className={promptNeedMoreFollowsDataClassName}>
                  <div
                    style={{
                      border: '2px solid purple',
                      padding: '10px',
                      borderRadius: '5px',
                      marginTop: '10px',
                      marginBottom: '10px',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    You need more follows data to extend your Grapevine beyond just one hop.
                    Download it
                    <CButton
                      color="primary"
                      style={{ marginLeft: '5px' }}
                      href="#/settings/settings"
                    >
                      here
                    </CButton>
                    .
                  </div>
                </div>
                <div
                  style={{
                    border: '1px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                  className={promptFollowForInfluenceUtilityClassName}
                >
                  YOU'RE NOT FOLLOWING ANYBODY. EVERYONE'S INFLUENCE SCORES WILL BE ZERO.
                  <br />
                  FOR INFLUENCE SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW SOMEONE.
                  <br />
                  BUT ONE IS ENOUGH! HOW ABOUT _____
                </div>
                <div
                  style={{
                    border: '1px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                  className={promptFollowForDosUtilityClassName}
                >
                  YOU'RE NOT FOLLOWING ANYBODY. EVERYONE'S DoS SCORE WILL BE ZERO.
                  <br />
                  FOR DoS SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW SOMEONE.
                </div>
                <div
                  style={{
                    border: '1px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                  className={promptFollowForWotUtilityClassName}
                >
                  YOU'RE NOT FOLLOWING ANYBODY. EVERYONE'S WoT SCORE WILL BE ZERO.
                  <br />
                  FOR WoT SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW LOTS OF PROFILES.
                  <br />
                  HOW ABOUT START WITH ONE FOLLOW AND THEN CHECK OUT THE DoS AND INFLUENCE SCORES.
                </div>
                <div className={promptLoginElemClassName}>
                  <div
                    style={{
                      border: '1px solid gold',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    You must{' '}
                    <CButton
                      color="primary"
                      href="#/login"
                      style={{ marginLeft: '5px', marginRight: '5px' }}
                    >
                      Login
                    </CButton>{' '}
                    first to sort by Degrees of Separation, Web of Trust, or Influence Scores.
                  </div>
                </div>
                <div className={promptCalcInfluenceScoreElemClassName}>
                  <div
                    style={{
                      border: '1px solid gold',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Influence Scores have not yet been calculated. To calculate Influence Scores, go
                    to{' '}
                    <CButton
                      color="primary"
                      href="#/grapevine/calculateInfluenceScores"
                      style={{ marginLeft: '5px' }}
                    >
                      this page
                    </CButton>
                    .
                  </div>
                </div>
                <div className={promptCalcDosScoreElemClassName}>
                  <div
                    style={{
                      border: '1px solid gold',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Degrees of Separation Scores have not yet been calculated. To calculate DoS Scores, go
                    to{' '}
                    <CButton
                      color="primary"
                      href="#/grapevine/calculateDosScores"
                      style={{ marginLeft: '5px' }}
                    >
                      this page
                    </CButton>
                    .
                  </div>
                </div>
                <div className={promptCalcWotScoreElemClassName}>
                  <div
                    style={{
                      border: '1px solid gold',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Web of Trust Scores have not yet been calculated. To calculate WoT Scores, go
                    to{' '}
                    <CButton
                      color="primary"
                      href="#/grapevine/calculateWotScores"
                      style={{ marginLeft: '5px' }}
                    >
                      this page
                    </CButton>
                    .
                  </div>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>
                      Author
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
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        WoT score{' '}
                        <CNavLink
                          href="#/grapevine/wotScore"
                          style={{ display: 'inline-block', marginLeft: '5px' }}
                        >
                          <CIcon
                            icon={cilInfo}
                            size="lg"
                            onClick={() => dispatch(updateApp('grapevine'))}
                          />
                        </CNavLink>
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={dosScoreColumnClassName}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        DoS score{' '}
                        <CNavLink
                          href="#/grapevine/dosScore"
                          style={{ display: 'inline-block', marginLeft: '5px' }}
                        >
                          <CIcon
                            icon={cilInfo}
                            size="lg"
                            onClick={() => dispatch(updateApp('grapevine'))}
                          />
                        </CNavLink>
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={influenceScoreColumnClassName}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        Influence score{' '}
                        <CNavLink
                          href="#/grapevine/influenceScore"
                          style={{ display: 'inline-block', marginLeft: '5px' }}
                        >
                          <CIcon
                            icon={cilInfo}
                            size="lg"
                            onClick={() => dispatch(updateApp('grapevine'))}
                          />
                        </CNavLink>
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={categoryColumnClassName}
                    >
                      category
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>
                      link
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aAuthorsSorted.map((pk, item) => {
                    const naddr = oAuthors[pk]
                    // const result = nip19.decode(naddr)
                    const npub = nip19.npubEncode(pk)
                    const oEvent = oEvents[naddr]
                    if (!oEvent || !validateEvent(oEvent)) {
                      return <></>
                    }
                    let category = fetchFirstByTag('c', oEvent)
                    if (!category) {
                      category = ''
                    }
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
                            getProfileBrainstormFromPubkey(pk, oProfilesByNpub).wotScores
                              .degreesOfSeparation
                          }
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={influenceScoreColumnClassName}
                        >
                          {
                            getProfileBrainstormFromNpub(npub, oProfilesByNpub).wotScores
                              .baselineInfluence.influence
                          }
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={categoryColumnClassName}
                        >
                          {category}
                        </CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>
                          <CButton color="primary">
                            <CNavLink
                              href="#/nostrapedia/article"
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
