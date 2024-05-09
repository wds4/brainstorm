import React, { useCallback, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CListGroup, CFormSwitch } from '@coreui/react'
import { useSelector } from 'react-redux'
import { ListEvent } from './ListEvent'
import { fetchFirstByTag } from 'src/helpers'
import Markdown from 'react-markdown'

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

const SingleEntry = ({ naddr, oEvent }) => {
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
  let titleStyle = {}
  let title = fetchFirstByTag('title', oEvent)
  if (!title) {
    title = 'no title provided'
    titleStyle = {
      color: 'orange',
    }
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="col" style={titleStyle}>
              <div style={{ textAlign: 'center', fontSize: '26px' }}>{title}</div>
            </div>
          </CCardHeader>
          <CCardBody>
            <Markdown>{content}</Markdown>
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
  )
}

const WikiTopic = () => {
  const [naddr, setNaddr] = useState('')
  const [oEvent, setOEvent] = useState({})
  const topicSlug = useSelector((state) => state.siteNavigation.wikifreedia.viewTopic)
  const oTopicSlugs = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oEvents = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oAuthors = oTopicSlugs[topicSlug]
  const aAuthors = Object.keys(oAuthors)

  let showVersions = aAuthors.length + ' versions'
  if (aAuthors.length == 1) {
    showVersions = aAuthors.length + ' version'
  }
  return (
    <>
      <center>
        <h3>Wikifreedia Topic</h3>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{topicSlug}</strong>
              <small style={{ float: 'right' }}>{showVersions}</small>
            </CCardHeader>
            <CCardBody>
              {aAuthors.map((pk) => {
                const naddr = oAuthors[pk]
                const oEvent = oEvents[naddr]
                return (
                  <CListGroup key={pk}>
                    <ListEvent
                      pubkey={pk}
                      oEvent={oEvent}
                      naddr={naddr}
                      setNaddr={setNaddr}
                      setOEvent={setOEvent}
                    />
                  </CListGroup>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <SingleEntry naddr={naddr} oEvent={oEvent} />
    </>
  )
}

export default WikiTopic
