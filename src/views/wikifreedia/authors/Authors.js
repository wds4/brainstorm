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
import { whenTopicWasLastUpdated } from '../singleTopic/SingleTopic'
import { secsToTime } from '../../../helpers'

const WikiAuthors = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  const currentSortAuthorsBy = useSelector(
    (state) => state.siteNavigation.wikifreedia.sortAuthorsBy,
  )
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState(currentSortAuthorsBy)
  const signedIn = useSelector((state) => state.profile.signedIn)
  const oAuthors = useSelector((state) => state.wikifreedia.authors)
  const aAuthors = Object.keys(oAuthors)
  const [aAuthorsFiltered, setAAuthorsFiltered] = useState(aAuthors)
  const [aAuthorsFilteredAndSorted, setAAuthorsFilteredAndSorted] = useState(aAuthors)

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [numTopicsColumnClassName, setNumTopicsColumnClassName] = useState('show') // show or hide
  const [dosScoreColumnClassName, setDosScoreColumnClassName] = useState('show') // show or hide
  const [wotScoreColumnClassName, setWotScoreColumnClassName] = useState('show') // show or hide
  const [influenceScoreColumnClassName, setInfluenceScoreColumnClassName] = useState('show') // show or hide

  const dispatch = useDispatch()

  ///// manage listener
  dispatch(turnListenerOff()) // poor performance on this page
  /*
  const filter = {
    kinds: [0, 3],
    authors: aAuthors,
  }

  dispatch(updateApp('wiki'))
  dispatch(updateFilter(filter))
  dispatch(turnListenerOn())
  dispatch(updateListenerApplication('wiki'))
  */
  ///// end manage listener

  const returnTimeOfMostRecentArticleByThisAuthor = (
    oAuthors,
    oWikiArticles_byNaddr,
    oWikiArticles_byDTag,
    pubkey,
  ) => {
    let mostRecent_thisAuthor = 0
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
    return mostRecent_thisAuthor
  }

  const sortItems = useCallback(
    (inputArray, sortByMethod) => {
      console.log('sortItems; inputArray.length: ' + inputArray.length)
      if (inputArray.length == 0) {
        console.log('empty array!')
        return inputArray
      } else {
        if (sortByMethod == 'alphabetical') {
          console.log('alphabetical')
          const arraySorted = inputArray.sort((a, b) =>
            getProfileBrainstormFromPubkey(a, oProfilesByNpub).brainstormDisplayName.localeCompare(
              getProfileBrainstormFromPubkey(b, oProfilesByNpub).brainstormDisplayName,
            ),
          )
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'reverseAlphabetical') {
          console.log('reverseAlphabetical')
          const arraySorted = inputArray.sort((a, b) =>
            getProfileBrainstormFromPubkey(b, oProfilesByNpub).brainstormDisplayName.localeCompare(
              getProfileBrainstormFromPubkey(a, oProfilesByNpub).brainstormDisplayName,
            ),
          )
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'numerical') {
          console.log('numerical')
          const arraySorted = inputArray.sort((a, b) => oAuthors[b].length - oAuthors[a].length)
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('show')
          setDosScoreColumnClassName('hide')
          setWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'chronological') {
          console.log('chronological')
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
          setWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          return arraySorted
        }
        if (sortByMethod == 'wotScore') {
          console.log('wotScore')
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setWotScoreColumnClassName('show')
          setInfluenceScoreColumnClassName('hide')
        }
        if (sortByMethod == 'influenceScore') {
          console.log('influenceScore')
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('hide')
          setWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('show')
        }
        if (sortByMethod == 'degreesOfSeparation') {
          console.log('degreesOfSeparation')
          setLastUpdateColumnClassName('hide')
          setNumTopicsColumnClassName('hide')
          setDosScoreColumnClassName('show')
          setWotScoreColumnClassName('hide')
          setInfluenceScoreColumnClassName('hide')
          const arraySorted = inputArray.sort(
            (a, b) =>
              getProfileBrainstormFromPubkey(a, oProfilesByNpub).wotScores.degreesOfSeparation -
              getProfileBrainstormFromPubkey(b, oProfilesByNpub).wotScores.degreesOfSeparation,
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
      console.log(
        'sortAndFilterItems; searchString: ' + searchString + '; sortByMethod: ' + sortByMethod,
      )
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
            (oProfileBrainstorm?.dislay_name &&
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
      sortAndFilterItems(searchField, sortBy)
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
            <CButton color="success" href="#/wikifreedia/publish">
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
                      <CTableHeaderCell className={numTopicsColumnClassName} scope="col">
                        # of topics
                      </CTableHeaderCell>
                      <CTableHeaderCell className={lastUpdateColumnClassName} scope="col">
                        last update
                      </CTableHeaderCell>
                      <CTableHeaderCell className={dosScoreColumnClassName} scope="col">
                        degrees of separation
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
                      return (
                        <CTableRow key={item}>
                          <CTableDataCell scope="row">
                            <ShowAuthorBrainstormProfile npub={npub} />
                          </CTableDataCell>
                          <CTableDataCell className={numTopicsColumnClassName}>
                            {oAuthors[pubkey].length}
                          </CTableDataCell>
                          <CTableDataCell className={lastUpdateColumnClassName}>
                            {howLongAgo}
                          </CTableDataCell>
                          <CTableDataCell className={dosScoreColumnClassName}>
                            {
                              getProfileBrainstormFromPubkey(pubkey, oProfilesByNpub).wotScores
                                .degreesOfSeparation
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
