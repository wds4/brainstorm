import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from 'src/helpers'
import { aGoodReactions, aBadReactions } from 'src/const'
import { getProfileBrainstormFromPubkey } from '../../../helpers/brainstorm'
import { defContextualWikiDislikeInterpScore, defContextualWikiLikeInterpScore } from '../../../const'

// eslint-disable-next-line react/prop-types
const ContextSelector = ({setContext, setContextualEndorsementsSelectedContextByCid, setORatedPubkeys}) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oNostrapedia = useSelector((state) => state.nostrapedia)
  const oByKind7EventId = oNostrapedia.kind7Ratings.byKind7EventId
  const oArticlesByDTag = oNostrapedia.articles.byDTag
  const oArticlesByEventId = oNostrapedia.articles.byEventId

  const oContextualEndorsementsByCid = useSelector((state) => state.grapevine.contextualEndorsements.byCid)

  const oContextualEndorsementsByContext = useSelector((state) => state.grapevine.contextualEndorsements.byContext)
  const aContextualEndorsementsByContext = Object.keys(oContextualEndorsementsByContext)
  const [aSelectableContexts, setASelectableContexts] = useState(aContextualEndorsementsByContext)
  const [oWikiReactionsByCategory, setOWikiReactionsByCategory] = useState({})

  const presumedConfidence_ = Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.contextualEndorsements.confidence)) / 100
  const confidenceWikiLikes_ = Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.wikiReactions.likes.confidence)) / 100
  const confidenceWikiDislikes_ = Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.wikiReactions.dislikes.confidence)) / 100

  const interpretedScoreFire = Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.contextualEndorsements.score.fire))
  const interpretedScoreThumbUp = Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.contextualEndorsements.score.thumbUp))
  const interpretedScoreThumbDown = Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.contextualEndorsements.score.thumbDown))

  const createListOfWikiReactedCategories = () => {
    const aSelectableContexts_temp = JSON.parse(JSON.stringify(aContextualEndorsementsByContext))
    let oWikiReactionsByCategory = {}
    Object.keys(oByKind7EventId).forEach((kind7EventId, item) => {
      const oKind7Event = oByKind7EventId[kind7EventId]
      const content = oKind7Event.content
      const pk_author = oKind7Event.pubkey
      const pk_ratee = fetchFirstByTag('p', oKind7Event)
      const articleEventId = fetchFirstByTag('e', oKind7Event)
      const oArticleEvent = oArticlesByEventId[articleEventId]
      const wikiContext = fetchFirstByTag('c', oArticleEvent)
      if (wikiContext) {
        if (!oWikiReactionsByCategory[wikiContext]) {
          oWikiReactionsByCategory[wikiContext] = []
        }
        if (!aSelectableContexts_temp.includes(wikiContext)) {
          aSelectableContexts_temp.push(wikiContext)
        }
        const oReaction = {
          reaction: content,
          pk_author,
          pk_ratee,
        }
        oWikiReactionsByCategory[wikiContext].push(oReaction)
      }

      Object.keys(oArticlesByDTag).forEach((dTag) => {
        // console.log('dTag: ' + dTag)
      })
    })
    console.log('oWikiReactionsByCategory: ' + JSON.stringify(oWikiReactionsByCategory, null, 4))
    console.log('aSelectableContexts_temp: ' + JSON.stringify(aSelectableContexts_temp, null, 4))
    setASelectableContexts(aSelectableContexts_temp)
    setOWikiReactionsByCategory(oWikiReactionsByCategory)
  }

  useEffect(() => {
    createListOfWikiReactedCategories()
  }, [])

  const updateContext = (e) => {
    const newContext = e.target.value
    console.log('updateContext; ' + e.target.value)
    if (newContext) {
      setContext(newContext)
      const oPubkeysContextualEndorsementRatees = {}
      // PROCESS WIKI LIKES AND DISLIKES
      if (oWikiReactionsByCategory[newContext]) {
        const aWikiReactionsThisCategory = oWikiReactionsByCategory[newContext]
        console.log('oWikiReactionsByCategory for this context: ' + JSON.stringify(aWikiReactionsThisCategory, null, 4))
        aWikiReactionsThisCategory.forEach(({reaction, pk_author, pk_ratee}) => {
          const rater_influence = getProfileBrainstormFromPubkey(pk_author, oProfilesByNpub).wotScores.baselineInfluence.influence
          if (rater_influence) { // ignore if rater influence is zero
            if (!oPubkeysContextualEndorsementRatees[pk_ratee]) {
              oPubkeysContextualEndorsementRatees[pk_ratee] = {}
              oPubkeysContextualEndorsementRatees[pk_ratee].sumOfInputs = 0
              oPubkeysContextualEndorsementRatees[pk_ratee].sumOfWeights = 0
              oPubkeysContextualEndorsementRatees[pk_ratee].averageScore = 0
              oPubkeysContextualEndorsementRatees[pk_ratee].ratersByPubkey = []
            }
            if (!oPubkeysContextualEndorsementRatees[pk_ratee].ratersByPubkey.includes(pk_author)) {
              oPubkeysContextualEndorsementRatees[pk_ratee].ratersByPubkey.push(pk_author)
            }
            let interpretedScore = 0
            let confidence_ = 0
            if (aGoodReactions.includes(reaction)) {
              interpretedScore = defContextualWikiLikeInterpScore
              confidence_ = confidenceWikiLikes_
            }
            if (aBadReactions.includes(reaction)) {
              interpretedScore = defContextualWikiDislikeInterpScore
              confidence_ = confidenceWikiDislikes_
            }
            const weight = confidence_ * rater_influence
            const input = weight * interpretedScore
            oPubkeysContextualEndorsementRatees[pk_ratee].sumOfInputs += input
            oPubkeysContextualEndorsementRatees[pk_ratee].sumOfWeights += weight
          }
        })
      }

      // PROCESS CONTEXTUAL ENDORSEMENTS
      if (oContextualEndorsementsByContext[newContext]) {
        const aCid = oContextualEndorsementsByContext[newContext]
        aCid.forEach((cid) => {
          const oEvent = oContextualEndorsementsByCid[cid]
          const pk_author = oEvent.pubkey
          const pk_ratee = fetchFirstByTag('p', oEvent)
          const score = fetchFirstByTag('score', oEvent)
          const context = fetchFirstByTag('c', oEvent)
          // console.log('cid: ' + cid + '; oEvent: ' + JSON.stringify(oEvent, null, 4))
          if (!oPubkeysContextualEndorsementRatees[pk_ratee]) {
            oPubkeysContextualEndorsementRatees[pk_ratee] = {}
            oPubkeysContextualEndorsementRatees[pk_ratee].sumOfInputs = 0
            oPubkeysContextualEndorsementRatees[pk_ratee].sumOfWeights = 0
            oPubkeysContextualEndorsementRatees[pk_ratee].averageScore = 0
            oPubkeysContextualEndorsementRatees[pk_ratee].ratersByPubkey = []
          }
          if (!oPubkeysContextualEndorsementRatees[pk_ratee].ratersByPubkey.includes(pk_author)) {
            oPubkeysContextualEndorsementRatees[pk_ratee].ratersByPubkey.push(pk_author)
          }
          const rater_influence = getProfileBrainstormFromPubkey(pk_author, oProfilesByNpub).wotScores.baselineInfluence.influence
          let interpretedScore = 0
          if (score == '🔥') {
            interpretedScore = interpretedScoreFire
          }
          if (score == '👍') {
            interpretedScore = interpretedScoreThumbUp
          }
          if (score == '👎') {
            interpretedScore = interpretedScoreThumbDown
          }
          const weight = presumedConfidence_ * rater_influence
          const input = weight * interpretedScore
          oPubkeysContextualEndorsementRatees[pk_ratee].sumOfInputs += input
          oPubkeysContextualEndorsementRatees[pk_ratee].sumOfWeights += weight
        })
      }
      setContextualEndorsementsSelectedContextByCid(oContextualEndorsementsByContext[newContext])
      setORatedPubkeys(oPubkeysContextualEndorsementRatees)
    }
  }
  return (
    <>
      <CFormSelect
        onChange={(e) => {
          updateContext(e)
        }}
      >
        <option value="unselected" selected disabled data-description="">
          select context
        </option>
        {aSelectableContexts.sort().map((context, item) => {
          return (
            <option key={item} value={context}>
              {context}
            </option>
          )
        })}
      </CFormSelect>
    </>
  )
}

export default ContextSelector
