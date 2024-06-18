import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
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
import CIcon from '@coreui/icons-react'
import { cilInfo, cilPencil } from '@coreui/icons'
import SortAndFilter from './sortAndFilter'
import {
  getProfileBrainstormFromNpub,
  getProfileBrainstormFromPubkey,
} from '../../../helpers/brainstorm'
import { whenTopicWasLastUpdated } from '../topic/Topic'
import { secsToTime } from '../../../helpers'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'
import WikiListener from '../../../helpers/listeners/WikiListener'
import { addNewPubkey } from '../../../redux/features/profiles/slice'
import { updateApp } from 'src/redux/features/siteNavigation/slice'

const WikiAuthors = () => {
  const myFollows = useSelector((state) => state.profile.kind3.follows)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oWikiArticles_byNaddr = useSelector((state) => state.nostrapedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.nostrapedia.articles.byDTag)
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState('chronological')
  const signedIn = useSelector((state) => state.profile.signedIn)
  const oAuthors = useSelector((state) => state.nostrapedia.authors)
  const aAuthors = Object.keys(oAuthors)
  const [aAuthorsFiltered, setAAuthorsFiltered] = useState(aAuthors)
  const [aAuthorsFilteredAndSorted, setAAuthorsFilteredAndSorted] = useState(aAuthors)

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [numTopicsColumnClassName, setNumTopicsColumnClassName] = useState('show') // show or hide
  const [dosScoreColumnClassName, setDosScoreColumnClassName] = useState('show') // show or hide
  const [coracleWotScoreColumnClassName, setCoracleWotScoreColumnClassName] = useState('show') // show or hide
  const [influenceScoreColumnClassName, setInfluenceScoreColumnClassName] = useState('show') // show or hide

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
    aMyFollows = oProfilesByNpub[myNpub].follows
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
  const [promptCalcDosScoreElemClassName, setPromptCalcDosScoreElemClassName] = useState('hide') // show or hide
  const [promptCalcWotScoreElemClassName, setPromptCalcWotScoreElemClassName] = useState('hide') // show or hide
  const [promptNeedMoreFollowsDataClassName, setPromptNeedMoreFollowsDataClassName] =
    useState('hide') // show or hide

  const [npubLookupFromPubkey, setNpubLookupFromPubkey] = useState({}) // show or hide
  const [dosLookupFromPubkey, setDosLookupFromPubkey] = useState({}) // show or hide

  const [coracleWotScore, setCoracleWotScore] = useState({}) // show or hide

  const dispatch = useDispatch()

  const initAuthorPubkey = () => {
    aAuthors.forEach((pubkey, item) => {
      if (!Object.keys(oProfilesByPubkey).includes(pubkey)) {
        dispatch(addNewPubkey(pubkey))
      }
    })
  }

  const makeNpubLookupFromPubkey = () => {
    const oOutput1 = {}
    const oOutput2 = {}
    aAuthors.forEach((pk) => {
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
    setNpubLookupFromPubkey(oOutput1)
    setCoracleWotScore(oOutput2)
  }

  const makeDosLookupFromPubkey = () => {
    const oOutput = {}
    aAuthors.forEach((pk) => {
      oOutput[pk] = getProfileBrainstormFromPubkey(
        pk,
        oProfilesByNpub,
      ).wotScores.degreesOfSeparation
    })
    setDosLookupFromPubkey(oOutput)
  }

  const returnTimeOfMostRecentArticleByThisAuthor = (
    oAuthors,
    oWikiArticles_byNaddr,
    oWikiArticles_byDTag,
    pubkey,
  ) => {
    let mostRecent_thisAuthor = 0
    if (oAuthors[pubkey]) {
      oAuthors[pubkey].forEach((t) => {
        const mostRecent_thisTopic = whenTopicWasLastUpdated(
          oWikiArticles_byNaddr,
          oWikiArticles_byDTag,
          t,
        )
        if (mostRecent_thisAuthor < mostRecent_thisTopic) {
          mostRecent_thisAuthor = mostRecent_thisTopic
        }
      })
    }
    return mostRecent_thisAuthor
  }

  const sortItems = useCallback(
    (inputArray, sortByMethod) => {
      if (inputArray.length == 0) {
        console.log('empty array!')
        return inputArray
      } else {
        if (sortByMethod == 'alphabetical') {
          const arraySorted = inputArray.sort((a, b) =>
            getProfileBrainstormFromPubkey(a, oProfilesByNpub).brainstormDisplayName.localeCompare(
              getProfileBrainstormFromPubkey(b, oProfilesByNpub).brainstormDisplayName,
            ),
          )
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'reverseAlphabetical') {
          const arraySorted = inputArray.sort((a, b) =>
            getProfileBrainstormFromPubkey(b, oProfilesByNpub).brainstormDisplayName.localeCompare(
              getProfileBrainstormFromPubkey(a, oProfilesByNpub).brainstormDisplayName,
            ),
          )
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'numerical') {
          const arraySorted = inputArray.sort((a, b) => oAuthors[b].length - oAuthors[a].length)
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('show')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'chronological') {
          const arraySorted = inputArray.sort(
            (a, b) =>
              returnTimeOfMostRecentArticleByThisAuthor(
                oAuthors,
                oWikiArticles_byNaddr,
                oWikiArticles_byDTag,
                b,
              ) -
              returnTimeOfMostRecentArticleByThisAuthor(
                oAuthors,
                oWikiArticles_byNaddr,
                oWikiArticles_byDTag,
                a,
              ),
          )
          setLastUpdateColumnClassName('show')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'wotScore') {
          if (!signedIn) {
            setPromptLoginElemClassName('show')
          }
          if (signedIn && aMyFollows.length == 0) {
            setPromptFollowForWotUtilityClassName('show')
          }
          if (signedIn && (aOneHop.length == 0 || aTwoHops.length == 0 || aMoreHops.length == 0)) {
            setPromptNeedMoreFollowsDataClassName('show')
          } else {
            if (!whenWotScoresUpdated) {
              if (signedIn) {
                // setPromptCalcWotScoreElemClassName('show')
              }
            }
          }
          promptFollowForWotUtilityClassName
          const arraySorted = inputArray.sort((a, b) => coracleWotScore[b] - coracleWotScore[a])
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('show')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'influenceScore') {
          if (!signedIn) {
            setPromptLoginElemClassName('show')
          }
          if (signedIn && aMyFollows.length == 0) {
            setPromptFollowForInfluenceUtilityClassName('show')
          }
          if (signedIn && (aOneHop.length == 0 || aTwoHops.length == 0 || aMoreHops.length == 0)) {
            setPromptNeedMoreFollowsDataClassName('show')
          } else {
            if (!whenInfluenceScoresUpdated) {
              if (signedIn) {
                setPromptCalcInfluenceScoreElemClassName('show')
              }
            }
          }
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('show')
          // const arraySorted = inputArray.sort((a, b) => Number(getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.baselineInfluence.influence) - Number(getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.baselineInfluence.influence))
          const arraySorted = inputArray.sort((a, b) => {
            const fooA =
              10000 *
              Number(
                getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.baselineInfluence
                  .influence,
              )
            const fooB =
              10000 *
              Number(
                getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.baselineInfluence
                  .influence,
              )
            const fooC = Math.floor(fooA) - Math.floor(fooB)
            return fooC
          })
          return arraySorted
        }
        if (sortByMethod == 'degreesOfSeparation') {
          if (!signedIn) {
            setPromptLoginElemClassName('show')
          }
          if (signedIn && aMyFollows.length == 0) {
            setPromptFollowForDosUtilityClassName('show')
          }
          if (signedIn && (aOneHop.length == 0 || aTwoHops.length == 0 || aMoreHops.length == 0)) {
            setPromptNeedMoreFollowsDataClassName('show')
          } else {
            if (!whenDosScoresUpdated) {
              if (signedIn) {
                setPromptCalcDosScoreElemClassName('show')
              }
            }
          }
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('show')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          const arraySorted = inputArray.sort(
            (a, b) => dosLookupFromPubkey[a] - dosLookupFromPubkey[b],
          )
          return arraySorted
        }
        return inputArray
      }
    },
    [searchField, sortBy],
  )

  const sortAndFilterItems = useCallback(
    (searchString, sortByMethod) => {
      if (!searchString) {
        setAAuthorsFiltered(aAuthors)
        setAAuthorsFilteredAndSorted(sortItems(JSON.parse(JSON.stringify(aAuthors)), sortByMethod))
      } else {
        const newFilteredArray = []
        aAuthors.forEach((pubkey) => {
          const npub = nip19.npubEncode(pubkey)
          const oProfileBrainstorm = getProfileBrainstormFromNpub(npub, oProfilesByNpub)
          if (
            npub.includes(searchString) ||
            oProfileBrainstorm.brainstormDisplayName.includes(searchString) ||
            (oProfileBrainstorm?.name && oProfileBrainstorm?.name.includes(searchString)) ||
            (oProfileBrainstorm?.display_name &&
              oProfileBrainstorm?.display_name.includes(searchString))
          ) {
            newFilteredArray.push(pubkey)
          }
        })
        setAAuthorsFiltered(newFilteredArray)
        setAAuthorsFilteredAndSorted(sortItems(newFilteredArray, sortByMethod))
      }
    },
    [searchField, sortBy],
  )

  useEffect(() => {
    initAuthorPubkey()
    try {
      makeNpubLookupFromPubkey() // temporary hack
      makeDosLookupFromPubkey() // temporary hack
      sortAndFilterItems(searchField, sortBy)
      setSearchField('npub') // TO DO for some wacky reason the degrees of separation sort doesn't work until I put something in the search field. even if I change it back manually later. wtf.
    } catch (e) {}
  }, [])

  const sortFilteredAuthors = useCallback(() => {}, [aAuthorsFiltered])

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }

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

  let numFollowsText = aProfilesWithKnownFollows.length + ' profiles'
  if (aProfilesWithKnownFollows.length == 1) {
    numFollowsText = aProfilesWithKnownFollows.length + ' profile'
  }
  return (
    <>
      <CContainer fluid>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ float: 'right' }} className={loggedInClassName}>
            <CButton color="success" href="#/nostrapedia/publish">
              <CIcon icon={cilPencil} /> Write an article
            </CButton>
          </div>
          <center>
            <h3>Authors</h3>
          </center>
        </div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flexGrow: '1' }}>
                    <strong>showing {aAuthorsFiltered.length} authors</strong>
                  </div>
                  <div style={{ flexGrow: 'auto' }}>
                    <strong>{aAuthors.length} authors in total</strong>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody>
                <SortAndFilter
                  searchField={searchField}
                  setSearchField={setSearchField}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortAndFilterItems={sortAndFilterItems}
                />
                <div className={promptNeedMoreFollowsDataClassName}>
                  <div
                    style={{
                      border: '1px solid purple',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    You need more follows data to extend your Grapevine to two (or more, ideally)
                    hops away. Download it under{' '}
                    <CButton
                      color="primary"
                      href="#/settings/settings"
                      style={{ marginLeft: '5px' }}
                    >
                      settings
                    </CButton>
                    .
                  </div>
                </div>
                <div
                  style={{
                    border: '1px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                  className={promptFollowForInfluenceUtilityClassName}
                >
                  EITHER YOU'RE NOT FOLLOWING ANYBODY, OR YOUR FOLLOWS HAVE NOT YET BEEN DOWNLOADED.
                  EVERYONE'S INFLUENCE SCORES WILL BE ZERO.
                  <br />
                  FOR INFLUENCE SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW SOMEONE.
                </div>
                <div
                  style={{
                    border: '1px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                  className={promptFollowForDosUtilityClassName}
                >
                  EITHER YOU'RE NOT FOLLOWING ANYBODY, OR YOUR FOLLOWS HAVE NOT YET BEEN DOWNLOADED.
                  EVERYONE'S DoS SCORE WILL BE ZERO.
                  <br />
                  FOR DoS SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW SOMEONE.
                </div>
                <div
                  style={{
                    border: '1px solid red',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                  className={promptFollowForWotUtilityClassName}
                >
                  EITHER YOU'RE NOT FOLLOWING ANYBODY, OR YOUR FOLLOWS HAVE NOT YET BEEN DOWNLOADED.
                  EVERYONE'S WoT SCORE WILL BE ZERO.
                  <br />
                  FOR WoT SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW LOTS OF PROFILES.
                </div>
                <div className={promptLoginElemClassName}>
                  <div
                    style={{
                      border: '1px solid gold',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
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
                    first to sort by Degrees of Separation, Web of Trust, Influence Score, or the Weighted Reaction Score.
                  </div>
                </div>
                <div className={promptCalcInfluenceScoreElemClassName}>
                  <div
                    style={{
                      border: '1px solid gold',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
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
                    Degrees of Separation Scores have not yet been calculated. To calculate DoS
                    Scores, go to{' '}
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
                    Web of Trust Scores have not yet been calculated. To calculate WoT Scores, go to{' '}
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
                <CTable striped small hover>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Author</CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ textAlign: 'center' }}
                        className={numTopicsColumnClassName}
                      >
                        # of topics
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
                        className={lastUpdateColumnClassName}
                      >
                        last update
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
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {aAuthorsFilteredAndSorted.map((pubkey, item) => {
                      const npub = nip19.npubEncode(pubkey)
                      const mostRecent_thisAuthor = returnTimeOfMostRecentArticleByThisAuthor(
                        oAuthors,
                        oWikiArticles_byNaddr,
                        oWikiArticles_byDTag,
                        pubkey,
                      )
                      const howLongAgo = secsToTime(mostRecent_thisAuthor)
                      let numAuthors = 0
                      if (oAuthors[pubkey]) {
                        numAuthors = oAuthors[pubkey].length
                      }
                      return (
                        <CTableRow key={item}>
                          <CTableDataCell scope="row">
                            <ShowAuthorBrainstormProfileImageOnly npub={npub} />
                          </CTableDataCell>
                          <CTableDataCell
                            scope="row"
                            style={{ textAlign: 'center' }}
                            className={numTopicsColumnClassName}
                          >
                            {numAuthors}
                          </CTableDataCell>
                          <CTableDataCell
                            scope="row"
                            style={{ textAlign: 'center' }}
                            className={coracleWotScoreColumnClassName}
                          >
                            {coracleWotScore[pubkey]}
                          </CTableDataCell>
                          <CTableDataCell
                            scope="row"
                            style={{ textAlign: 'center' }}
                            className={lastUpdateColumnClassName}
                          >
                            {howLongAgo}
                          </CTableDataCell>
                          <CTableDataCell
                            scope="row"
                            style={{ textAlign: 'center' }}
                            className={dosScoreColumnClassName}
                          >
                            {
                              getProfileBrainstormFromPubkey(pubkey, oProfilesByNpub).wotScores
                                .degreesOfSeparation
                            }
                          </CTableDataCell>
                          <CTableDataCell
                            scope="row"
                            style={{ textAlign: 'center' }}
                            className={influenceScoreColumnClassName}
                          >
                            {
                              getProfileBrainstormFromPubkey(pubkey, oProfilesByNpub).wotScores
                                .baselineInfluence.influence
                            }
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
      </CContainer>
      <WikiListener />
    </>
  )
}

export default WikiAuthors

// <ShowAuthorBrainstormProfile npub={npub} />
