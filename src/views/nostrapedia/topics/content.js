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
  CPopover,
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
import { whenTopicWasLastUpdated } from '../topic/Topic'
import { fetchFirstByTag, secsToTime, timeout } from '../../../helpers'
import { returnKind7Results } from '../../../helpers/nostrapedia'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import { getProfileBrainstormFromPubkey } from '../../../helpers/brainstorm'

const WikiArticlesAlphabetical = () => {
  const dispatch = useDispatch()
  const oNostrapedia = useSelector((state) => state.nostrapedia)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const currentSortTopicsBy = useSelector((state) => state.siteNavigation.nostrapedia.sortTopicsBy)
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState('numerical')
  const oWikiArticles_byNaddr = useSelector((state) => state.nostrapedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.nostrapedia.articles.byDTag)
  let aTopicsRef = []
  if (Object.keys(oWikiArticles_byDTag)) {
    aTopicsRef = Object.keys(oWikiArticles_byDTag).sort()
  }
  const [aTopicsFiltered, setATopicsFiltered] = useState(aTopicsRef)

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [numVersionsColumnClassName, setNumVersionsColumnClassName] = useState('show') // show or hide
  const [popularityColumnClassName, setPopularityColumnClassName] = useState('show') // show or hide
  const [controversyColumnClassName, setControversyColumnClassName] = useState('show') // show or hide
  const [trendingColumnClassName, setTrendingColumnClassName] = useState('show') // show or hide

  // lookup trending, popularity, and controversy scores for each topic
  const [compositeScoresLookup, setCompositeScoresLookup] = useState({}) // show or hide

  const initializeCompositeScores = () => {
    let newCompositeScoresLookup = {}
    aTopicsRef.forEach((nextTopicSlug, item) => {
      newCompositeScoresLookup[nextTopicSlug] = {}
      newCompositeScoresLookup[nextTopicSlug].compositeScores = {}
      newCompositeScoresLookup[nextTopicSlug].compositeScores.trending = {}
      newCompositeScoresLookup[nextTopicSlug].compositeScores.trending.local = 0
      newCompositeScoresLookup[nextTopicSlug].compositeScores.trending.global = 0
      newCompositeScoresLookup[nextTopicSlug].compositeScores.popularity = {}
      newCompositeScoresLookup[nextTopicSlug].compositeScores.popularity.local = 0
      newCompositeScoresLookup[nextTopicSlug].compositeScores.popularity.global = 0
      newCompositeScoresLookup[nextTopicSlug].compositeScores.controversy = {}
      newCompositeScoresLookup[nextTopicSlug].compositeScores.controversy.local = 0
      newCompositeScoresLookup[nextTopicSlug].compositeScores.controversy.global = 0
    })
    setCompositeScoresLookup(newCompositeScoresLookup)
    return newCompositeScoresLookup
  }

  const calculateCompositeScores = (csLookup) => {
    const currentTime = Math.floor(Date.now() / 1000)
    const timeConstant = 1000000
    // const timeConstant = 1000000000000000
    let newCompositeScoresLookup = JSON.parse(JSON.stringify(csLookup))
    // add author data
    // add likes and dislikes data
    let oKind7Ratings = {}
    if (oNostrapedia.kind7Ratings) {
      oKind7Ratings = oNostrapedia.kind7Ratings
    }
    let oKind7Ratings_byKind7EventId = {}
    let oKind7Ratings_byArticleEventId = {}
    if (oKind7Ratings) {
      oKind7Ratings_byKind7EventId = oKind7Ratings.byKind7EventId
      oKind7Ratings_byArticleEventId = oKind7Ratings.byArticleEventId
    }
    Object.keys(oKind7Ratings_byArticleEventId).forEach((articleEventId, item) => {
      if (oNostrapedia.articles.byEventId[articleEventId]) {
        const oEvent = oNostrapedia.articles.byEventId[articleEventId]
        const pubkey_author = oEvent.pubkey
        const influenceScore_author = Number(
          getProfileBrainstormFromPubkey(pubkey_author, oProfilesByNpub).wotScores.baselineInfluence
            .influence,
        )
        const topicSlug = fetchFirstByTag('d', oEvent)
        let article_published_at = Number(fetchFirstByTag('published_at', oEvent))
        if (!article_published_at) {
          article_published_at = oEvent.created_at
        }
        const article_ageInSeconds = currentTime - article_published_at
        const normalizedAge = -article_ageInSeconds / timeConstant
        const creationBoost = Math.exp(normalizedAge)
        newCompositeScoresLookup[topicSlug].compositeScores.trending.local +=
          creationBoost * influenceScore_author // need to factor in the influence score of the author
        newCompositeScoresLookup[topicSlug].compositeScores.trending.global += creationBoost
        let aLikes = []
        let aDislikes = []
        if (oKind7Ratings_byArticleEventId[articleEventId]) {
          aLikes = oKind7Ratings_byArticleEventId[articleEventId].likes
          aDislikes = oKind7Ratings_byArticleEventId[articleEventId].dislikes
        }
        aLikes.forEach((kind7EventId, item) => {
          const oKind7Event = oKind7Ratings_byKind7EventId[kind7EventId]
          const pubkey_reactor = oKind7Event.pubkey
          const influenceScore_reactor = Number(
            getProfileBrainstormFromPubkey(pubkey_reactor, oProfilesByNpub).wotScores
              .baselineInfluence.influence,
          )

          // popularity
          newCompositeScoresLookup[topicSlug].compositeScores.popularity.local +=
            influenceScore_reactor
          newCompositeScoresLookup[topicSlug].compositeScores.popularity.global += 1

          // trending
          let reaction_published_at = fetchFirstByTag('published_at', oKind7Event)
          if (!reaction_published_at) {
            reaction_published_at = oKind7Event.created_at
          }
          const reaction_ageInSeconds = currentTime - reaction_published_at
          const normalizedAge = -reaction_ageInSeconds / timeConstant
          const reactionBoost = Math.exp(normalizedAge)
          newCompositeScoresLookup[topicSlug].compositeScores.trending.local +=
            reactionBoost * influenceScore_reactor // need to factor in the influence score of the author
          newCompositeScoresLookup[topicSlug].compositeScores.trending.global += reactionBoost
        })
        aDislikes.forEach((kind7EventId, item) => {
          const oKind7Event = oKind7Ratings_byKind7EventId[kind7EventId]
          const pubkey_reactor = oKind7Event.pubkey
          const influenceScore_reactor = Number(
            getProfileBrainstormFromPubkey(pubkey_reactor, oProfilesByNpub).wotScores
              .baselineInfluence.influence,
          )

          // controversy
          newCompositeScoresLookup[topicSlug].compositeScores.controversy.global += 1
          newCompositeScoresLookup[topicSlug].compositeScores.controversy.local +=
            influenceScore_reactor

          // trending
          // TO DO: decide whether dislikes should count towards the trending score
          /*
          let reaction_published_at = fetchFirstByTag('published_at', oKind7Event)
          if (!reaction_published_at) {
            reaction_published_at = oKind7Event.created_at
          }
          const reaction_ageInSeconds = currentTime - reaction_published_at
          const normalizedAge = - reaction_ageInSeconds / timeConstant
          const reactionBoost = Math.exp(normalizedAge)
          newCompositeScoresLookup[topicSlug].compositeScores.trending.local += reactionBoost * influenceScore_reactor // need to factor in the influence score of the author
          newCompositeScoresLookup[topicSlug].compositeScores.trending.global += reactionBoost
          */
        })
      }
    })

    /*
    const { numLikes, numDislikes, weightLikes, weightDislikes } = returnKind7Results(
      oNostrapedia,
      articleEventId,
      oProfilesByNpub,
    )
    */

    setCompositeScoresLookup(newCompositeScoresLookup)
    return newCompositeScoresLookup
  }

  const returnCompositeScore_local = (topicSlug, whichScore, csLookup) => {
    if (csLookup && csLookup[topicSlug] && csLookup[topicSlug].compositeScores) {
      let score_local = csLookup[topicSlug].compositeScores[whichScore].local.toPrecision(4)
      if (score_local == 0.0) {
        score_local = 0
      }
      return score_local
    }
    return 999
  }

  const returnCompositeScore_global = (topicSlug, whichScore, csLookup) => {
    if (csLookup && csLookup[topicSlug] && csLookup[topicSlug].compositeScores) {
      let score_global = csLookup[topicSlug].compositeScores[whichScore].global
      if (whichScore == 'trending') {
        // controversy and popularity global scores are integer if global so do not need rounding
        score_global = score_global.toPrecision(4)
      }
      return score_global
    }
    return 999
  }

  const initSortTopicsBy = () => {
    updateSortBySelector(currentSortTopicsBy)
    if (currentSortTopicsBy == 'numerical') {
      setNumVersionsColumnClassName('show')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (currentSortTopicsBy == 'chronological') {
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('show')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (currentSortTopicsBy == 'popularity') {
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('show')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (currentSortTopicsBy == 'controversy') {
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('show')
      setTrendingColumnClassName('hide')
    }
    if (currentSortTopicsBy == 'trending') {
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('show')
    }
  }

  useEffect(() => {
    // calculate popularity, controversy, and trending scores for each topic
    // controversy: for each article in the topic, add up total number of negative likes, weighted by Influence Score
    // trending: for each article in the topic, look at time of creation (most recent edit), time of each like or dislike;
    // multiply by Influence Score of author; and multiply by an exponential decay factor to take into account the age of the action
    const csLookupInit = initializeCompositeScores()
    const csLookup = calculateCompositeScores(csLookupInit)
    initSortTopicsBy()
    sortFilteredTopics(currentSortTopicsBy, aTopicsFiltered, csLookup)
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

  const sortFilteredTopics = (newSortByValue, aTopicsFiltered, csLookup) => {
    if (newSortByValue == 'alphabetical') {
      const aFoo = aTopicsFiltered.sort()
      setATopicsFiltered(aFoo)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (newSortByValue == 'reverseAlphabetical') {
      const aFoo = aTopicsFiltered.sort().reverse()
      setATopicsFiltered(aFoo)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
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
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (newSortByValue == 'chronological') {
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
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (newSortByValue == 'popularity') {
      const aFoo = aTopicsFiltered.sort(
        (a, b) =>
          returnCompositeScore_local(b, 'popularity', csLookup) -
          returnCompositeScore_local(a, 'popularity', csLookup),
      )
      setATopicsFiltered(aFoo)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('show')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('hide')
    }
    if (newSortByValue == 'controversy') {
      const aFoo = aTopicsFiltered.sort(
        (a, b) =>
          returnCompositeScore_local(b, 'controversy', csLookup) -
          returnCompositeScore_local(a, 'controversy', csLookup),
      )
      setATopicsFiltered(aFoo)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('show')
      setTrendingColumnClassName('hide')
    }
    if (newSortByValue == 'trending') {
      const aFoo = aTopicsFiltered.sort(
        (a, b) =>
          returnCompositeScore_local(b, 'trending', csLookup) -
          returnCompositeScore_local(a, 'trending', csLookup),
      )
      setATopicsFiltered(aFoo)
      setNumVersionsColumnClassName('hide')
      setLastUpdateColumnClassName('hide')
      setPopularityColumnClassName('hide')
      setControversyColumnClassName('hide')
      setTrendingColumnClassName('show')
    }
  }

  const handleSortByChange = useCallback(
    (newSortByValue) => {
      sortFilteredTopics(newSortByValue, aTopicsFiltered, compositeScoresLookup)
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

  let popularityDescription = "the Popularity Score: sum over likes, each of which is weighted by the Influence Score of the reactor. This includes likes of prior versions of a given article."
  // popularityDescription += " (Parentheses: global score; does not weight by Influence Score.)"

  let trendingDescription = "the Trending Score: calculated from age of likes, age of dislikes, and age of the article, and weighted by the Influence Score of the author or reactor. This includes reactions to prior versions of a given article."
  // popularityDescription += " (Parentheses: global score; does not weight by Influence Score.)"

  let controversyDescription = "the Controversy Score: sum over dislikes, each of which is weighted by the Influence Score of the reactor. This includes dislikes of prior versions of a given article."
  // popularityDescription += " (Parentheses: global score; does not weight by Influence Score.)"
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
                      { label: 'popularity', value: 'popularity' }, // weighted sum of all kind 7 reactions; aka attention, reviews
                      { label: 'controversy', value: 'controversy' }, // weighted sum of negative kind 7 reactions
                      { label: 'trending', value: 'trending' }, // weighted sum of negative kind 7 reactions
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
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={popularityColumnClassName}
                    >
                      popularity
                      <span style={{ color: 'grey', marginLeft: '5px' }}>
                        <CPopover
                          content={popularityDescription}
                          placement="left"
                          trigger={['hover', 'focus']}
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CPopover>
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={controversyColumnClassName}
                    >
                      controversy
                      <span style={{ color: 'grey', marginLeft: '5px' }}>
                        <CPopover
                          content={controversyDescription}
                          placement="left"
                          trigger={['hover', 'focus']}
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CPopover>
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={trendingColumnClassName}
                    >
                      trending
                      <span style={{ color: 'grey', marginLeft: '5px' }}>
                        <CPopover
                          content={trendingDescription}
                          placement="left"
                          trigger={['hover', 'focus']}
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CPopover>
                      </span>
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
                            href="#/nostrapedia/topic"
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

                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={popularityColumnClassName}
                        >
                          {returnCompositeScore_local(
                            topicSlug,
                            'popularity',
                            compositeScoresLookup,
                          )}
                          <div style={{ display: 'none', marginLeft: '50px' }}>
                            (
                            {returnCompositeScore_global(
                              topicSlug,
                              'popularity',
                              compositeScoresLookup,
                            )}
                            )
                          </div>
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={controversyColumnClassName}
                        >
                          {returnCompositeScore_local(
                            topicSlug,
                            'controversy',
                            compositeScoresLookup,
                          )}
                          <div style={{ display: 'none', marginLeft: '50px' }}>
                            (
                            {returnCompositeScore_global(
                              topicSlug,
                              'controversy',
                              compositeScoresLookup,
                            )}
                            )
                          </div>
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: 'center' }}
                          className={trendingColumnClassName}
                        >
                          {returnCompositeScore_local(topicSlug, 'trending', compositeScoresLookup)}
                          <div style={{ display: 'none', marginLeft: '50px' }}>
                            (
                            {returnCompositeScore_global(
                              topicSlug,
                              'trending',
                              compositeScoresLookup,
                            )}
                            )
                          </div>
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
