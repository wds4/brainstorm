import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSwitch,
  CButton,
  CNavLink,
  CPopover,
  CContainer,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import Markdown from 'react-markdown'
import { fetchFirstByTag, secsToTimeAgo } from 'src/helpers'
import { updateViewNostrapediaTopic } from 'src/redux/features/siteNavigation/slice'
import { processWikiMarkdownLinks } from 'src/helpers/contentFilters'
import { ShowAuthor } from '../components/ShowAuthor'
import { nip19 } from 'nostr-tools'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'
import { ShowTinyAuthorBrainstormProfileImageOnly } from '../components/ShowTinyAuthorBrainstormProfileImageOnly'
import CIcon from '@coreui/icons-react'
import { cilFire, cilInfo, cilThumbDown, cilThumbUp } from '@coreui/icons'
import { returnKind7Results } from '../../../helpers/nostrapedia'
import { signEventPGA } from 'src/helpers/signers'
import { useNostr } from 'nostr-react'
import { removeKind7EventId } from '../../../redux/features/nostrapedia/slice'

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

const ThreeOptionsRating = () => {
  const [muteButtonColor, setMuteButtonColor] = useState('light')
  const [followButtonColor, setFollowButtonColor] = useState('light')
  const [superfollowButtonColor, setSuperfollowButtonColor] = useState('light')

  const processMuteButtonClick = useCallback(async () => {
    // updateScore('0')
    setFollowButtonColor('light')
    setMuteButtonColor('danger')
    setSuperfollowButtonColor('light')
  }, [])
  const processFollowButtonClick = useCallback(async () => {
    // updateScore('100')
    setFollowButtonColor('success')
    setMuteButtonColor('light')
    setSuperfollowButtonColor('light')
  }, [])

  const processSuperfollowButtonClick = useCallback(async () => {
    // updateScore('0')
    setFollowButtonColor('light')
    setMuteButtonColor('light')
    setSuperfollowButtonColor('primary')
  }, [])

  const MuteButton = ({ muteButtonColor }) => {
    if (muteButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbDown} size="lg" />
        </>
      )
    }
    if (muteButtonColor == 'danger') {
      return <>👎</>
    }
    return <></>
  }

  const FollowButton = ({ followButtonColor }) => {
    if (followButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbUp} size="lg" />
        </>
      )
    }
    if (followButtonColor == 'success') {
      return <>👍</>
    }
    return <></>
  }

  const SuperfollowButton = ({ superfollowButtonColor }) => {
    if (superfollowButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilFire} size="lg" />
        </>
      )
    }
    if (superfollowButtonColor == 'primary') {
      return <>🔥</>
    }
    return <></>
  }
  return (
    <>
      <div>
        <span>Do you like this article? </span>
        <CButton
          id="muteButtonElem"
          type="button"
          color={muteButtonColor}
          onClick={processMuteButtonClick}
        >
          <MuteButton muteButtonColor={muteButtonColor} />
        </CButton>
        <CButton
          type="button"
          color={followButtonColor}
          onClick={processFollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          <FollowButton followButtonColor={followButtonColor} />
        </CButton>
        <CButton
          type="button"
          color={superfollowButtonColor}
          onClick={processSuperfollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          <SuperfollowButton superfollowButtonColor={superfollowButtonColor} />
        </CButton>
        <span style={{ color: 'grey', marginLeft: '5px' }}>
          <CPopover
            content="rate this author in this category"
            placement="left"
            trigger={['hover', 'focus']}
          >
            <CIcon icon={cilInfo} size="lg" />
          </CPopover>
        </span>
      </div>
    </>
  )
}

const TwoOptionsRating = ({ oNostrapedia, oArticleEvent }) => {
  const oProfile = useSelector((state) => state.profile)
  const [muteButtonColor, setMuteButtonColor] = useState('light')
  const [followButtonColor, setFollowButtonColor] = useState('light')

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
            setFollowButtonColor('success')
          }
        })
        aDislikes.forEach((eId) => {
          const oK7Event = oNostrapedia.kind7Ratings.byKind7EventId[eId]
          const pk_reactor = oK7Event.pubkey
          if (pk_reactor == myPubkey) {
            setMeNoLikeyKind7eventId(eId)
            setMuteButtonColor('danger')
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
      console.log(
        'processKind5Event; whichReaction: ' +
          whichReaction +
          '; mLk7eId: ' +
          mLk7eId +
          '; mNLk7eId: ' +
          mNLk7eId,
      )
      const currentTime = Math.floor(Date.now() / 1000)
      const topicSlug = fetchFirstByTag('d', oArticleEvent)
      let oEventNew = JSON.parse(JSON.stringify(kind5EventDefault))
      const aTags = [['p', myPubkey]]
      let submitDelete = false
      let eIdToRemove = ''
      if (whichReaction == 'follow' && mLk7eId) {
        // delete my existing follow event
        aTags.push(['e', mLk7eId])
        setMeLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mLk7eId
      }
      if (whichReaction == 'mute' && mNLk7eId) {
        // delete my existing mute event
        aTags.push(['e', mNLk7eId])
        setMeNoLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mNLk7eId
      }
      if (whichReaction == '' && mNLk7eId) {
        // delete my existing follow event
        aTags.push(['e', mNLk7eId])
        setMeNoLikeyKind7eventId('')
        submitDelete = true
        eIdToRemove = mNLk7eId
      }
      if (whichReaction == '' && mLk7eId) {
        // delete my existing mute event
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
        console.log('PUBLISH KIND 5 EVENT')
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
        console.log('PUBLISH KIND 7 EVENT')
        publish(oEventNew_signed)
      }
      if (newContent == '-') {
        const oEventNew_signed = await signEventPGA(oProfile, oEventNew)
        setKind7Event(oEventNew_signed)
        setMeNoLikeyKind7eventId(oEventNew_signed.id)
        console.log('PUBLISH KIND 7 EVENT')
        publish(oEventNew_signed)
      }
      if (newContent == '') {
        setKind7Event(oEventNew)
      }
    },
    [meLikeyKind7eventId, meNoLikeyKind7eventId],
  )

  const processMuteButtonClick = useCallback(() => {
    if (muteButtonColor == 'danger') {
      setFollowButtonColor('light')
      setMuteButtonColor('light')
      processKind5Event('mute', meLikeyKind7eventId, meNoLikeyKind7eventId) // delete existing mute event
      processKind7Event('')
    }
    if (muteButtonColor == 'light') {
      setFollowButtonColor('light')
      setMuteButtonColor('danger')
      processKind5Event('', meLikeyKind7eventId, meNoLikeyKind7eventId)
      processKind7Event('-')
    }
  }, [muteButtonColor, meLikeyKind7eventId, meNoLikeyKind7eventId])

  const processFollowButtonClick = useCallback(() => {
    if (followButtonColor == 'success') {
      setFollowButtonColor('light')
      setMuteButtonColor('light')
      processKind5Event('follow', meLikeyKind7eventId, meNoLikeyKind7eventId) // delete existing follow event
      processKind7Event('')
    }
    if (followButtonColor == 'light') {
      setFollowButtonColor('success')
      setMuteButtonColor('light')
      processKind5Event('', meLikeyKind7eventId, meNoLikeyKind7eventId)
      processKind7Event('+')
    }
  }, [followButtonColor, meLikeyKind7eventId, meNoLikeyKind7eventId])

  const MuteButton = ({ muteButtonColor }) => {
    if (muteButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbDown} size="lg" />
        </>
      )
    }
    if (muteButtonColor == 'danger') {
      return <>👎</>
    }
    return <></>
  }

  const FollowButton = ({ followButtonColor }) => {
    if (followButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbUp} size="lg" />
        </>
      )
    }
    if (followButtonColor == 'success') {
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
          id="muteButtonElem"
          type="button"
          color={muteButtonColor}
          onClick={processMuteButtonClick}
        >
          <MuteButton muteButtonColor={muteButtonColor} />
        </CButton>
        <CButton
          type="button"
          color={followButtonColor}
          onClick={processFollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          <FollowButton followButtonColor={followButtonColor} />
        </CButton>
      </div>
      <div style={{ display: 'none' }}>
        <pre>{JSON.stringify(kind7Event, null, 4)}</pre>
        <pre>{JSON.stringify(kind5Event, null, 4)}</pre>
      </div>
    </>
  )
}

const DisplayCategory = ({ oEvent }) => {
  let category = fetchFirstByTag('c', oEvent)
  if (!category) {
    return <></>
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-right">
        <div style={{ display: 'flex' }}>
          <span style={{ color: 'grey' }}>category: </span>
          <span style={{ marginLeft: '5px' }}>{category}</span>
        </div>
      </div>
    </>
  )
}

const ReactionPanel = ({ oKind7Results }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '30px',
          alignItems: 'center',
        }}
      >
        <div className="col-auto">
          <span style={{ marginRight: '5px', fontSize: '24px', color: '#6261cc' }}>
            {(oKind7Results.weightLikes - oKind7Results.weightDislikes).toPrecision(4)}
          </span>
          <CPopover
            content="the Weighted Reaction Score: likes minus dislikes, each of which is weighted by the Influence Score of the reactor"
            placement="right"
            trigger={['hover', 'focus']}
          >
            <span style={{ color: 'grey' }}>
              <CIcon icon={cilInfo} />
            </span>
          </CPopover>
        </div>
        <div className="col-auto">
          <CIcon icon={cilThumbUp} size="lg" style={{ marginRight: '5px' }} />
          {oKind7Results.aLikesByPubkey.map((pk, item) => {
            const npub = nip19.npubEncode(pk)
            return (
              <span key={item}>
                <ShowTinyAuthorBrainstormProfileImageOnly npub={npub} />
              </span>
            )
          })}
        </div>
        <div className="col-auto">
          <CIcon icon={cilThumbDown} size="lg" style={{ marginRight: '5px' }} />
          {oKind7Results.aDislikesByPubkey.map((pk, item) => {
            const npub = nip19.npubEncode(pk)
            return (
              <span key={item}>
                <ShowTinyAuthorBrainstormProfileImageOnly npub={npub} />
              </span>
            )
          })}
        </div>
      </div>
    </>
  )
}

const WikiArticle = () => {
  const dispatch = useDispatch()
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oTopicSlugs = useSelector((state) => state.nostrapedia.articles.byDTag)
  const aTopicSlugs = Object.keys(oTopicSlugs)
  const naddr = useSelector((state) => state.siteNavigation.nostrapedia.viewArticle)
  const oEvents = useSelector((state) => state.nostrapedia.articles.byNaddr)
  const oEvent = oEvents[naddr]
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const toggleShowRawData = useCallback(
    (e) => {
      if (showRawDataButton == 'hide') {
        setShowRawDataButton('show')
      }
      if (showRawDataButton == 'show') {
        setShowRawDataButton('hide')
      }
    },
    [showRawDataButton],
  )
  const content = oEvent?.content
  const pubkey = oEvent?.pubkey
  const npub = nip19.npubEncode(pubkey)
  let titleStyle = {}
  const title = fetchFirstByTag('title', oEvent)
  const topicSlug = fetchFirstByTag('d', oEvent)
  const oAuthors = oTopicSlugs[topicSlug]
  const aAuthors = Object.keys(oAuthors)
  let showVersions = 'There are ' + aAuthors.length + ' versions of this topic.'
  if (aAuthors.length == 1) {
    showVersions = 'There is ' + aAuthors.length + ' version of this topic.'
  }
  let published_at = fetchFirstByTag('published_at', oEvent)
  if (!published_at) {
    published_at = oEvent.created_at
  }
  const displayTime = secsToTimeAgo(published_at)

  let titleShow = title
  if (!titleShow) {
    titleShow = topicSlug
  }
  if (!titleShow) {
    titleShow = 'no title provided'
    titleStyle = {
      color: 'orange',
    }
  }
  const processViewTopicClick = (topicSlug) => {
    dispatch(updateViewNostrapediaTopic(topicSlug))
  }
  const contentWithLinks = processWikiMarkdownLinks(content, aTopicSlugs)
  const topicHref = '#/nostrapedia/topic?topic=' + topicSlug
  const editThisArticleRef = '#/nostrapedia/publish?naddr=' + naddr

  // add up likes and dislikes
  const oNostrapedia = useSelector((state) => state.nostrapedia)
  const articleEventId = oEvent.id
  const oKind7Results = returnKind7Results(oNostrapedia, articleEventId, oProfilesByNpub)
  return (
    <>
      <CContainer fluid style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <CRow style={{ display: 'flex', alignItems: 'center' }}>
          <CCol xs="auto" className="me-auto">
            <h1>
              <div style={{ display: 'inline-block' }}>{titleShow}</div>{' '}
            </h1>
          </CCol>
          <CCol xs="auto" className="align-self-center" style={{ color: 'grey' }}>
            <DisplayCategory oEvent={oEvent} />
          </CCol>
        </CRow>
        <ReactionPanel oKind7Results={oKind7Results} />
        <CRow>
          <TwoOptionsRating oNostrapedia={oNostrapedia} oArticleEvent={oEvent} />
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <CRow style={{ display: 'flex', alignItems: 'center' }}>
                  <CCol xs="auto" className="me-auto">
                    <ShowAuthorBrainstormProfileImageOnly npub={npub} />
                  </CCol>
                  <CCol xs="auto" className="align-self-center" style={{ color: 'grey' }}>
                    {displayTime}
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <div style={{ overflow: 'scroll' }}>
                  <Markdown>{contentWithLinks}</Markdown>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-block' }}>
                    <CFormSwitch
                      onChange={(e) => toggleShowRawData(e)}
                      label="raw JSON"
                      id="formSwitchCheckDefault"
                    />
                  </div>
                </div>
              </CCardBody>
            </CCard>
            <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} naddr={naddr} />
          </CCol>
        </CRow>
        <div className="row justify-content-between">
          <CCol style={{ color: 'grey' }}>{showVersions}</CCol>
          <CCol className="col-auto">
            <CButton color="primary">
              <CNavLink href={topicHref} onClick={() => processViewTopicClick(topicSlug)}>
                View all versions of {topicSlug}
              </CNavLink>
            </CButton>
          </CCol>
          <CCol className="col-auto">
            <CButton color="primary">
              <CNavLink href={editThisArticleRef}>Edit</CNavLink>
            </CButton>
          </CCol>
        </div>
        <br />
      </CContainer>
    </>
  )
}

export default WikiArticle
