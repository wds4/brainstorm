import React, { useCallback, useState } from 'react'
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
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import Markdown from 'react-markdown'
import { fetchFirstByTag, secsToTimeAgo } from 'src/helpers'
import { updateViewNostrapediaTopic } from 'src/redux/features/siteNavigation/slice'
import { processWikiMarkdownLinks } from 'src/helpers/contentFilters'
import { ShowAuthor } from '../components/ShowAuthor'
import { nip19 } from 'nostr-tools'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import WikiLikesListener from '../../../helpers/listeners/WikiLikesListener'

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
  const [muteButtonColor, setMuteButtonColor] = useState('secondary')
  const [followButtonColor, setFollowButtonColor] = useState('secondary')
  const [superfollowButtonColor, setSuperfollowButtonColor] = useState('secondary')

  const processMuteButtonClick = useCallback(async () => {
    // updateScore('0')
    setFollowButtonColor('secondary')
    setMuteButtonColor('danger')
    setSuperfollowButtonColor('secondary')
  }, [])
  const processFollowButtonClick = useCallback(async () => {
    // updateScore('100')
    setFollowButtonColor('success')
    setMuteButtonColor('secondary')
    setSuperfollowButtonColor('secondary')
    console.log('processFollowButtonClick B')
  }, [])

  const processSuperfollowButtonClick = useCallback(async () => {
    // updateScore('0')
    setFollowButtonColor('secondary')
    setMuteButtonColor('secondary')
    setSuperfollowButtonColor('primary')
  }, [])
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <CButton type="button" color={muteButtonColor} onClick={processMuteButtonClick}>
          👎
        </CButton>
        <CButton
          type="button"
          color={followButtonColor}
          onClick={processFollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          👍
        </CButton>
        <CButton
          type="button"
          color={superfollowButtonColor}
          onClick={processSuperfollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          🔥
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
        <div style={{ textAlign: 'center' }}>
          <ThreeOptionsRating />
        </div>
      </div>
    </>
  )
}

const WikiArticle = () => {
  const dispatch = useDispatch()
  const oTopicSlugs = useSelector((state) => state.wikifreedia.articles.byDTag)
  const aTopicSlugs = Object.keys(oTopicSlugs)
  const naddr = useSelector((state) => state.siteNavigation.wikifreedia.viewArticle)
  const oEvents = useSelector((state) => state.wikifreedia.articles.byNaddr)
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
  return (
    <>
      <center>
        <h1>
          <div style={{ display: 'inline-block' }}>{titleShow}</div>{' '}
          <div style={{ display: 'inline-block' }}>
            <ThreeOptionsRating />
          </div>
        </h1>
      </center>
      <WikiLikesListener eventId={oEvent?.id} />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <DisplayCategory oEvent={oEvent} />
              <CRow style={{ display: 'flex', alignItems: 'center' }}>
                <CCol xs="auto" className="me-auto">
                  <ShowAuthorBrainstormProfileImageOnly npub={npub} />
                </CCol>
                <CCol>
                  <div style={{ textAlign: 'center' }}>
                    <ThreeOptionsRating />
                  </div>
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
    </>
  )
}

export default WikiArticle
