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
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import Markdown from 'react-markdown'
import { fetchFirstByTag, secsToTimeAgo } from 'src/helpers'
import { updateViewNostrapediaTopic } from 'src/redux/features/siteNavigation/slice'
import { processWikiMarkdownLinks } from 'src/helpers/contentFilters'
import { ShowAuthor } from '../components/ShowAuthor'
import { nip19 } from 'nostr-tools'

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
    <div style={{ textAlign: 'right' }}>
      <span style={{ color: 'grey' }}>category: </span>
      <span>{category}</span>
    </div>
  )
}

const WikiEntry = () => {
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
  const topicHref = '#/wikifreedia/singleTopic?topic=' + topicSlug
  const editThisArticleRef = '#/wikifreedia/publish?naddr=' + naddr
  return (
    <>
      <center>
        <h1>
          <strong>{titleShow}</strong>
        </h1>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <DisplayCategory oEvent={oEvent} />
              <CRow style={{ display: 'flex', alignItems: 'center' }}>
                <CCol xs="auto" className="me-auto">
                  <ShowAuthor npub={npub} />
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

export default WikiEntry
