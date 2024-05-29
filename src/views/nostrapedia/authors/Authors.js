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
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import { nip19 } from 'nostr-tools'
import { ShowAuthor } from '../components/ShowAuthor'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import SortAndFilter from './sortAndFilter'
import {
  getProfileBrainstormFromNpub,
  getProfileBrainstormFromPubkey,
} from '../../../helpers/brainstorm'
import { ShowAuthorBrainstormProfile } from '../components/ShowAuthorBrainstormProfile'
import { updateApp } from '../../../redux/features/siteNavigation/slice'
import {
  turnListenerOff,
  turnListenerOn,
  updateFilter,
  updateFilterAuthors,
  updateListenerApplication,
} from '../../../redux/features/listenerManager/slice'
import { whenTopicWasLastUpdated } from '../topic/Topic'
import { secsToTime } from '../../../helpers'
import { ShowAuthorImageOnly } from '../components/ShowAuthorImageOnly'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'

const WikiAuthors = () => {
  const myFollows = useSelector((state) => state.profile.kind3.follows)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState('chronological')
  const signedIn = useSelector((state) => state.profile.signedIn)
  const oAuthors = useSelector((state) => state.wikifreedia.authors)
  const aAuthors = Object.keys(oAuthors)
  const [aAuthorsFiltered, setAAuthorsFiltered] = useState(aAuthors)
  const [aAuthorsFilteredAndSorted, setAAuthorsFilteredAndSorted] = useState(aAuthors)

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [numTopicsColumnClassName, setNumTopicsColumnClassName] = useState('show') // show or hide
  const [dosScoreColumnClassName, setDosScoreColumnClassName] = useState('show') // show or hide
  const [coracleWotScoreColumnClassName, setCoracleWotScoreColumnClassName] = useState('show') // show or hide
  const [influenceScoreColumnClassName, setInfluenceScoreColumnClassName] = useState('show') // show or hide

  const [npubLookupFromPubkey, setNpubLookupFromPubkey] = useState({}) // show or hide
  const [dosLookupFromPubkey, setDosLookupFromPubkey] = useState({}) // show or hide

  const [coracleWotScore, setCoracleWotScore] = useState({}) // show or hide

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
          const arraySorted = inputArray.sort((a, b) => coracleWotScore[b] - coracleWotScore[a])
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('show')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'influenceScore') {
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setCoracleWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('show')
          // const arraySorted = inputArray.sort((a, b) => Number(getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.baselineInfluence.influence) - Number(getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.baselineInfluence.influence))
          const arraySorted = inputArray.sort(
            (a, b) =>
              getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.baselineInfluence.influence -
              getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.baselineInfluence.influence,
          )
          return arraySorted
        }
        if (sortByMethod == 'degreesOfSeparation') {
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
                <CTable striped small hover>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell scope="col">author</CTableHeaderCell>
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
                        WoT score
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
                        degrees of separation
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ textAlign: 'center' }}
                        className={influenceScoreColumnClassName}
                      >
                        influence score
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
    </>
  )
}

export default WikiAuthors

// <ShowAuthorBrainstormProfile npub={npub} />