import React, { useCallback, useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFirstByTag } from 'src/helpers'
import CIcon from '@coreui/icons-react'
import { cilThumbDown, cilThumbUp } from '@coreui/icons'
import { signEventPGA } from 'src/helpers/signers'
import { useNostr } from 'nostr-react'
import { removeKind7EventId } from '../../../redux/features/nostrapedia/slice'

const LikeOrDislikeButtons = ({ oNostrapedia, oArticleEvent }) => {
  const oProfile = useSelector((state) => state.profile)
  const [dislikeButtonColor, setDislikeButtonColor] = useState('light')
  const [likeButtonColor, setLikeButtonColor] = useState('light')

  const [meLikeyKind7eventId, setMeLikeyKind7eventId] = useState('')
  const [meNoLikeyKind7eventId, setMeNoLikeyKind7eventId] = useState('')
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const oRaters = oNostrapedia.kind7Ratings.byArticleEventId[oArticleEvent.id]

  const kind7EventDefault = {
    kind: 7,
    content: '',
    tags: [],
  }
  const kind5EventDefault = {
    kind: 5,
    content: 'Delete reaction',
    tags: [['p', myPubkey]],
  }

  useEffect(() => {
    if (oRaters) {
      const aLikes = oRaters.likes
      const aDislikes = oRaters.dislikes
      if (aLikes) {
        aLikes.forEach((eId) => {
          const oK7Event = oNostrapedia.kind7Ratings.byKind7EventId[eId]
          const pk_reactor = oK7Event.pubkey
          if (pk_reactor == myPubkey) {
            setMeLikeyKind7eventId(eId)
            setLikeButtonColor('success')
          }
        })
        aDislikes.forEach((eId) => {
          const oK7Event = oNostrapedia.kind7Ratings.byKind7EventId[eId]
          const pk_reactor = oK7Event.pubkey
          if (pk_reactor == myPubkey) {
            setMeNoLikeyKind7eventId(eId)
            setDislikeButtonColor('danger')
          }
        })
      }
    }
  }, [])

  const [kind7Event, setKind7Event] = useState(kind7EventDefault)
  const [kind5Event, setKind5Event] = useState(kind5EventDefault)

  const { publish } = useNostr()
  const dispatch = useDispatch()

  const processKind5Event = useCallback(
    async (whichReaction, mLk7eId, mNLk7eId) => {
      const currentTime = Math.floor(Date.now() / 1000)
      const topicSlug = fetchFirstByTag('d', oArticleEvent)
      let oEventNew = JSON.parse(JSON.stringify(kind5EventDefault))
      const aTags = [['p', myPubkey]]
      let submitDelete = false
      let eIdToRemove = ''
      if (whichReaction == 'like' && mLk7eId) {
        // delete my existing like event
        aTags.push(['e', mLk7eId])
        setMeLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mLk7eId
      }
      if (whichReaction == 'dislike' && mNLk7eId) {
        // delete my existing dislike event
        aTags.push(['e', mNLk7eId])
        setMeNoLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mNLk7eId
      }
      if (whichReaction == '' && mNLk7eId) {
        // delete my existing like event
        aTags.push(['e', mNLk7eId])
        setMeNoLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mNLk7eId
      }
      if (whichReaction == '' && mLk7eId) {
        // delete my existing dislike event
        aTags.push(['e', mLk7eId])
        setMeLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mLk7eId
      }
      if (submitDelete == true) {
        oEventNew.tags = aTags
        oEventNew.created_at = currentTime
        const oEventNew_signed = await signEventPGA(oProfile, oEventNew)
        setKind5Event(oEventNew_signed)
        // TO DO: publish event
        publish(oEventNew_signed)
        // TO DO: remove old eId from redux, eIdToRemove
        dispatch(removeKind7EventId(eIdToRemove))
      }
      if (submitDelete == false) {
        oEventNew.content = ''
        oEventNew.tags = []
        setKind5Event(oEventNew)
        // do not publish
      }
    },
    [meLikeyKind7eventId, meNoLikeyKind7eventId],
  )

  const processKind7Event = useCallback(
    async (newContent) => {
      let oEventNew = JSON.parse(JSON.stringify(kind7EventDefault))
      const topicSlug = fetchFirstByTag('d', oArticleEvent)
      const aTags = []
      const tag_a = oArticleEvent.kind + ':' + oArticleEvent.pubkey + ':' + topicSlug
      aTags.push(['a', tag_a])
      aTags.push(['p', oArticleEvent.pubkey])
      aTags.push(['e', oArticleEvent.id])
      aTags.push(['k', '30818'])
      aTags.push(['client', 'brainstorm'])
      oEventNew.content = newContent
      const currentTime = Math.floor(Date.now() / 1000)
      oEventNew.created_at = currentTime
      if (newContent) {
        oEventNew.tags = aTags
      }
      if (newContent == '+') {
        const oEventNew_signed = await signEventPGA(oProfile, oEventNew)
        setKind7Event(oEventNew_signed)
        setMeLikeyKind7eventId(oEventNew_signed.id)
        publish(oEventNew_signed)
      }
      if (newContent == '-') {
        const oEventNew_signed = await signEventPGA(oProfile, oEventNew)
        setKind7Event(oEventNew_signed)
        setMeNoLikeyKind7eventId(oEventNew_signed.id)
        publish(oEventNew_signed)
      }
      if (newContent == '') {
        setKind7Event(oEventNew)
      }
    },
    [meLikeyKind7eventId, meNoLikeyKind7eventId],
  )

  const processDislikeButtonClick = useCallback(() => {
    if (dislikeButtonColor == 'danger') {
      setLikeButtonColor('light')
      setDislikeButtonColor('light')
      processKind5Event('dislike', meLikeyKind7eventId, meNoLikeyKind7eventId) // delete existing dislike event
      processKind7Event('')
    }
    if (dislikeButtonColor == 'light') {
      setLikeButtonColor('light')
      setDislikeButtonColor('danger')
      processKind5Event('', meLikeyKind7eventId, meNoLikeyKind7eventId)
      processKind7Event('-')
    }
  }, [dislikeButtonColor, meLikeyKind7eventId, meNoLikeyKind7eventId])

  const processLikeButtonClick = useCallback(() => {
    if (likeButtonColor == 'success') {
      setLikeButtonColor('light')
      setDislikeButtonColor('light')
      processKind5Event('like', meLikeyKind7eventId, meNoLikeyKind7eventId) // delete existing like event
      processKind7Event('')
    }
    if (likeButtonColor == 'light') {
      setLikeButtonColor('success')
      setDislikeButtonColor('light')
      processKind5Event('', meLikeyKind7eventId, meNoLikeyKind7eventId)
      processKind7Event('+')
    }
  }, [likeButtonColor, meLikeyKind7eventId, meNoLikeyKind7eventId])

  const DislikeButton = ({ dislikeButtonColor }) => {
    if (dislikeButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbDown} size="lg" />
        </>
      )
    }
    if (dislikeButtonColor == 'danger') {
      return <>👎</>
    }
    return <></>
  }

  const LikeButton = ({ likeButtonColor }) => {
    if (likeButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbUp} size="lg" />
        </>
      )
    }
    if (likeButtonColor == 'success') {
      return <>👍</>
    }
    return <></>
  }
  return (
    <>
      <div style={{ display: 'none' }}>
        <div>oRaters: {JSON.stringify(oRaters)}</div>
        <div>meLikeyKind7eventId: {meLikeyKind7eventId}</div>
        <div>meNoLikeyKind7eventId: {meNoLikeyKind7eventId}</div>
      </div>
      <div>
        <span>Do you like this article? </span>
        <CButton
          id="dislikeButtonElem"
          type="button"
          color={dislikeButtonColor}
          onClick={processDislikeButtonClick}
        >
          <DislikeButton dislikeButtonColor={dislikeButtonColor} />
        </CButton>
        <CButton
          type="button"
          color={likeButtonColor}
          onClick={processLikeButtonClick}
          style={{ marginLeft: '5px' }}
        >
          <LikeButton likeButtonColor={likeButtonColor} />
        </CButton>
      </div>
      <div style={{ display: 'none' }}>
        <pre>{JSON.stringify(kind7Event, null, 4)}</pre>
        <pre>{JSON.stringify(kind5Event, null, 4)}</pre>
      </div>
    </>
  )
}

export default LikeOrDislikeButtons
