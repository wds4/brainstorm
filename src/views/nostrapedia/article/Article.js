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
  CContainer,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import Markdown from 'react-markdown'
import { fetchFirstByTag, secsToTimeAgo } from 'src/helpers'
import { updateViewNostrapediaTopic } from 'src/redux/features/siteNavigation/slice'
import { processWikiMarkdownLinks } from 'src/helpers/contentFilters'
import { nip19 } from 'nostr-tools'
import { ShowAuthorBrainstormProfileImageOnly } from '../components/ShowAuthorBrainstormProfileImageOnly'
import { returnKind7Results } from '../../../helpers/nostrapedia'
import LikeOrDislikeButtons from './LikeOrDislikeButtons'
import WeightedReactionScorePanel from './WeightedReactionScorePanel'
import { useSearchParams } from 'react-router-dom'
import { updateViewNostrapediaArticle } from '../../../redux/features/siteNavigation/slice'
import WikiListener from '../../../helpers/listeners-ndk-react/WikiListener'
import WikiNaddrListener from '../../../helpers/listeners-ndk-react/WikiNaddrListener'

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

const FetchArticleByNaddr = ({ naddr, oEvents }) => {
  // if naddr is not in oEvents, need to fetch it
  // TO DO: write listener for single naddr
  // (currently, the generic WikiListener is already active on this page, so all articles should be fetched relatively quickly;
  // If the numnber of articles get too high, and dewnloading all of them gets too slow, may need to remove generic WikiListener and add single naddr listener for better performance;
  // In that case, maybe add generic WikiListener here only if single naddr is already downloaded)
  if (!oEvents[naddr]) {
    return <WikiNaddrListener naddr={naddr} />
  }
  // otherwise, no need to fetch it
  return <WikiListener />
}

const WikiArticle = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const viewArticle = useSelector((state) => state.siteNavigation.nostrapedia.viewArticle)
  const [naddr, setNaddr] = useState(viewArticle)

  useEffect(() => {
    function updateNaddrFromUrl() {
      const naddrFromUrl = searchParams.get('naddr')
      if (naddrFromUrl) {
        dispatch(updateViewNostrapediaArticle(naddrFromUrl))
        setNaddr(naddrFromUrl)
      }
    }
    updateNaddrFromUrl()
  }, [])

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oTopicSlugs = useSelector((state) => state.nostrapedia.articles.byDTag)
  const aTopicSlugs = Object.keys(oTopicSlugs)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const oEvents = useSelector((state) => state.nostrapedia.articles.byNaddr)
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

  let oEvent = {}
  if (oEvents && naddr && oEvents[naddr]) {
    oEvent = oEvents[naddr]
  }

  const content = oEvent?.content
  const pubkey = oEvent?.pubkey
  let npub = ''
  if (pubkey) {
    npub = nip19.npubEncode(pubkey)
  }
  const title = fetchFirstByTag('title', oEvent)
  const topicSlug = fetchFirstByTag('d', oEvent)
  const oAuthors = oTopicSlugs[topicSlug]
  let aAuthors = []
  if (oAuthors) {
    aAuthors = Object.keys(oAuthors)
  }
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
    titleShow = ''
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
        <FetchArticleByNaddr naddr={naddr} oEvents={oEvents} />
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
        <WeightedReactionScorePanel oKind7Results={oKind7Results} />
        <CRow>
          <LikeOrDislikeButtons oNostrapedia={oNostrapedia} oArticleEvent={oEvent} />
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
