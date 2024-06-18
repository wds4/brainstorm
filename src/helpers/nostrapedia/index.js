import { getProfileBrainstormFromPubkey } from "../brainstorm"

export const returnKind7Results = (oNostrapedia, articleEventId, oProfilesByNpub) => {
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
  let aLikes = []
  let aDislikes = []
  if (oKind7Ratings_byArticleEventId[articleEventId]) {
    aLikes = oKind7Ratings_byArticleEventId[articleEventId].likes
    aDislikes = oKind7Ratings_byArticleEventId[articleEventId].dislikes
  }

  let weightLikes = 0
  let weightDislikes = 0
  const aLikesByPubkey = []
  const aDislikesByPubkey = []
  aLikes.forEach((kind7EventId, item) => {
    const oKind7Event = oKind7Ratings_byKind7EventId[kind7EventId]
    const pk = oKind7Event.pubkey
    const influenceScorePk = getProfileBrainstormFromPubkey(pk, oProfilesByNpub).wotScores.baselineInfluence.influence
    if (!aLikesByPubkey.includes(pk)) {
      weightLikes += Number(influenceScorePk)
      aLikesByPubkey.push(pk)
    }
  })
  aDislikes.forEach((kind7EventId, item) => {
    const oKind7Event = oKind7Ratings_byKind7EventId[kind7EventId]
    const pk = oKind7Event.pubkey
    const influenceScorePk = getProfileBrainstormFromPubkey(pk, oProfilesByNpub).wotScores.baselineInfluence.influence
    if (!aDislikesByPubkey.includes(pk)) {
      weightDislikes += Number(influenceScorePk)
      aDislikesByPubkey.push(pk)
    }
  })

  const numLikes = aLikesByPubkey.length
  const numDislikes = aDislikesByPubkey.length

  return { numLikes, numDislikes, weightLikes, weightDislikes, aLikesByPubkey, aDislikesByPubkey }
}
