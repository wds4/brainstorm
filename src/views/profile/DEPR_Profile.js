import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CCol, CContainer, CNav, CNavLink, CRow } from '@coreui/react'
import LeaveRating from './leaveRating/leaveTrustAttestation'
import TabsNavigation from './tabsNavigation'
import ContextualFollowBlockButtons from './contextualFollowBlockButtons'

// eslint-disable-next-line react/prop-types
const ProfileTabsContent = ({ whichTab, npub }) => {
  if (whichTab == 'about') {
    return <>profile tabs content: {whichTab} </>
  }
  if (whichTab == 'notes') {
    return <>profile tabs content: {whichTab} </>
  }
  if (whichTab == 'leaveRating') {
    return <LeaveRating rateeNpub={npub} />
  }
  if (whichTab == 'ratingsOf') {
    return <>profile tabs content: {whichTab} </>
  }
  if (whichTab == 'ratingsBy') {
    return <>profile tabs content: {whichTab} </>
  }
  if (whichTab == 'wotScores') {
    return <>profile tabs content: {whichTab} </>
  }
  return <>profile tabs content: {whichTab} </>
}

const Profile = () => {
  const [whichTab, setWhichTab] = useState('about') // use names of apps: about, notes, leaveRating, ratingsOf, ratingsBy, wotScores
  const { getProfile } = useNDK()
  const npub = useSelector((state) => state.siteNavigation.npub)
  const oProfile = getProfile(npub)
  return (
    <CContainer fluid>
      <div className="d-grid gap-2 col-12 mx-auto">
        <CRow>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                maxHeight: '200px',
                position: 'absolute',
                top: '0px',
                overflow: 'scroll',
              }}
            >
              <img
                src={oProfile?.banner}
                style={{
                  borderRadius: '20px 20px 0px 0px',
                  width: '100%',
                  opacity: '0.0',
                }}
                alt=""
              />
            </div>
          </div>
        </CRow>
        <CRow>
          <CCol sm="auto">
            <div className="profileAvatarContainer">
              <img src={oProfile?.image} className="profileAvatarLarge" />
            </div>
          </CCol>
          <CCol sm="auto">
            <div className="d-grid gap-2">
              <div>
                <span style={{ fontSize: '34px', marginRight: '20px' }}>
                  {oProfile?.displayName}
                </span>
                <span style={{ color: 'grey' }}>@{oProfile?.name}</span>
              </div>
              <small>{npub}</small>
            </div>
          </CCol>
        </CRow>
        <ContextualFollowBlockButtons rateeNpub={npub} />
        <CRow>
          <TabsNavigation updateWhichTab={setWhichTab} />
        </CRow>
        <CRow>
          <ProfileTabsContent whichTab={whichTab} npub={npub} />
        </CRow>
      </div>
    </CContainer>
  )
}

export default Profile
