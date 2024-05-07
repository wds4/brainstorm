import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CCol, CContainer, CNav, CNavLink, CRow } from '@coreui/react'
import LeaveRating from './leaveRating/leaveTrustAttestation'
import TabsNavigation from './tabsNavigation'
import ContextualFollowBlockButtons from './contextualFollowBlockButtons/contextualFollowBlockButtons'

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
    <div className="container-fluid">
      <div className="row">
        <div className="col-5 profileAvatarContainer">
          <img src={oProfile?.image} className="profileAvatarLarge" />
        </div>
        <div className="col">
          <div>
            <span style={{ fontSize: '34px', marginRight: '20px' }}>{oProfile?.displayName}</span>
            <span style={{ color: 'grey' }}>@{oProfile?.name}</span>
          </div>
          <ContextualFollowBlockButtons rateeNpub={npub} />
        </div>
      </div>
      <CRow>
        <TabsNavigation updateWhichTab={setWhichTab} />
      </CRow>
      <CRow>
        <ProfileTabsContent whichTab={whichTab} npub={npub} />
      </CRow>
    </div>
  )
}

export default Profile
