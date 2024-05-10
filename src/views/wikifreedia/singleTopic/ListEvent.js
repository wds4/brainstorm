import React, { useCallback, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CFormSwitch, CNavLink, CRow } from '@coreui/react'
import { nip19 } from 'nostr-tools'
import { useDispatch } from 'react-redux'
import { secsToTimeAgo, fetchFirstByTag } from 'src/helpers'
import { updateViewWikifreediaArticle } from '../../../redux/features/siteNavigation/slice'
import { ShowAuthor } from '../components/ShowAuthor'

const Details = ({ showDetailsButton, title, category, categoryStyle, displayTime }) => {
  if (showDetailsButton == 'hide') {
    return <></>
  }
  return (
    <>
      <br />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol className="col-3" style={{ color: 'grey', textAlign: 'right' }}>
              title:
            </CCol>
            <CCol className="col-9">{title}</CCol>
          </CRow>
          <CRow>
            <CCol className="col-3" style={{ color: 'grey', textAlign: 'right' }}>
              category:
            </CCol>
            <CCol className="col-9">{category}</CCol>
          </CRow>
          <CRow>
            <CCol className="col-3" style={{ color: 'grey', textAlign: 'right' }}>
              when last updated:
            </CCol>
            <CCol className="col-9">{displayTime}</CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

// eslint-disable-next-line react/prop-types
export const ListEvent = ({ pubkey, oEvent, naddr }) => {
  const [showDetailsButton, setShowDetailsButton] = useState('hide')
  const toggleShowDetails = useCallback(
    (e) => {
      if (showDetailsButton == 'hide') {
        setShowDetailsButton('show')
      }
      if (showDetailsButton == 'show') {
        setShowDetailsButton('hide')
      }
    },
    [showDetailsButton],
  )

  const dispatch = useDispatch()

  // title
  let titleStyle = {
    display: 'inline-block',
  }
  let title = fetchFirstByTag('title', oEvent)
  if (!title) {
    title = 'no title provided'
    titleStyle = {
      color: 'orange',
      display: 'inline-block',
    }
  }

  // category
  let categoryStyle = {}
  let category = fetchFirstByTag('c', oEvent)
  if (!category) {
    category = 'no category provided'
    categoryStyle = {
      color: 'orange',
    }
  }

  const npub = nip19.npubEncode(pubkey)

  let published_at = fetchFirstByTag('published_at', oEvent)
  if (!published_at) {
    published_at = oEvent.created_at
  }
  const displayTime = secsToTimeAgo(published_at)

  const processViewArticleClick = (naddr) => {
    dispatch(updateViewWikifreediaArticle(naddr))
  }
  return (
    <>
      <div className="row justify-content-between">
        <div className="col">
          <ShowAuthor npub={npub} />
        </div>
        <div className="col-auto" style={{ display: 'flex', alignItems: 'center' }}>
          <CButton color="primary">
            <CNavLink
              href="#/wikifreedia/singleEntry"
              onClick={() => processViewArticleClick(naddr)}
            >
              View Article
            </CNavLink>
          </CButton>
        </div>
        <div className="col-auto" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'inline-block' }}>
            <CFormSwitch onChange={(e) => toggleShowDetails(e)} />
          </div>
        </div>
      </div>
      <Details
        showDetailsButton={showDetailsButton}
        title={title}
        category={category}
        categoryStyle={categoryStyle}
        displayTime={displayTime}
      />
    </>
  )
}
