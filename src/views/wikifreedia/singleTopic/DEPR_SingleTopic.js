import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CListGroup,
  CFormSwitch,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { ListEvent } from './ListEvent'
import { fetchFirstByTag } from 'src/helpers'
import Markdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom'
import { updateViewWikifreediaTopic } from 'src/redux/features/siteNavigation/slice'
import { nip19 } from 'nostr-tools'
import { ShowAuthor } from '../components/ShowAuthor'

export const whenTopicWasLastUpdated = (oEvents, oTopicSlugs, topicSlug) => {
  if (!topicSlug) {
    return 0
  }
  let mostRecentUpdate = 0
  const oEventsByPubkey = oTopicSlugs[topicSlug]
  if (!oEventsByPubkey) {
    return 0
  }
  const aPubkeys = Object.keys(oEventsByPubkey)
  aPubkeys.forEach((pk, item) => {
    const naddr = oEventsByPubkey[pk]
    const oEvent = oEvents[naddr]
    mostRecentUpdate = Math.max(mostRecentUpdate, oEvent.created_at)
  })
  return mostRecentUpdate
}

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

const WikiTopic = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const viewTopic = useSelector((state) => state.siteNavigation.wikifreedia.viewTopic)
  const [topicSlug, setTopicSlug] = useState(viewTopic)
  const oTopicSlugs = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oEvents = useSelector((state) => state.wikifreedia.articles.byNaddr)
  let oAuthors = {}
  let aAuthors = []
  if (oTopicSlugs[topicSlug]) {
    oAuthors = oTopicSlugs[topicSlug]
    aAuthors = Object.keys(oAuthors)
  }
  const mostRecentUpdate = whenTopicWasLastUpdated(oEvents, oTopicSlugs, topicSlug)

  const [lastUpdateColumnClassName, setLastUpdateColumnClassName] = useState('show') // show or hide
  const [dosColumnClassName, setDosColumnClassName] = useState('show') // show or hide

  const dispatch = useDispatch()

  useEffect(() => {
    function updateTopicFromUrl() {
      const topicFromUrl = searchParams.get('topic')
      if (topicFromUrl) {
        dispatch(updateViewWikifreediaTopic(topicFromUrl))
        setTopicSlug(topicFromUrl)
      }
    }
    updateTopicFromUrl()
  }, [topicSlug])

  let showVersions = 'There are ' + aAuthors.length + ' versions of this article.'
  if (aAuthors.length == 1) {
    showVersions = 'There is ' + aAuthors.length + ' version of this article.'
  }
  return (
    <>
      <center>
        <h1>
          <strong>{topicSlug}</strong>
        </h1>
      </center>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <small>{showVersions}</small>
            </CCardHeader>
            <CCardBody>
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">author</CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ textAlign: 'center' }}
                      className={lastUpdateColumnClassName}
                    >
                      last update
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className={dosColumnClassName}>
                      degree of separation
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aAuthors.map((pk, item) => {
                    const naddr = oAuthors[pk]
                    const npub = nip19.npubEncode(pk)
                    const oEvent = oEvents[naddr]
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <ShowAuthor npub={npub} />
                        </CTableDataCell>
                        <CTableDataCell className={lastUpdateColumnClassName}>
                          ?
                        </CTableDataCell>
                        <CTableDataCell className={dosColumnClassName}>
                          ?
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

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <small>{showVersions}</small>
            </CCardHeader>
            <CCardBody>
              {aAuthors.map((pk) => {
                const naddr = oAuthors[pk]
                const oEvent = oEvents[naddr]
                return (
                  <CListGroup key={pk}>
                    <ListEvent pubkey={pk} oEvent={oEvent} naddr={naddr} />
                  </CListGroup>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WikiTopic