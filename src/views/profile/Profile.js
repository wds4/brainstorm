import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CCol, CContainer, CNav, CNavLink, CRow } from '@coreui/react'
import LeaveRating from './leaveRating/leaveTrustAttestation'
import TabsNavigation from './tabsNavigation'
import ContextualFollowBlockButtons from './contextualFollowBlockButtons/contextualFollowBlockButtons'
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import About from './about/About'
import Notes from './notes/notes'
import { getPubkeyFromNpub } from '../../helpers/nip19'
import Wikis from './wikis/Wikis'

// eslint-disable-next-line react/prop-types
const ProfileTabsContent = ({ whichTab, npub, pubkey, oProfile }) => {
  if (whichTab == 'about') {
    return <About oProfile={oProfile} npub={npub} pubkey={pubkey} />
  }
  if (whichTab == 'notes') {
    return <Notes oProfile={oProfile} pubkey={pubkey} />
  }
  if (whichTab == 'wikis') {
    return <Wikis oProfile={oProfile} npub={npub} pubkey={pubkey} />
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

  const pubkey = getPubkeyFromNpub(npub)

  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('user npub copied to clipboard: \n ' + np)
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-5 profileAvatarContainer">
          <img src={oProfile?.image} className="profileAvatarLarge" />
        </div>
        <div className="col" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '34px', marginRight: '20px' }}>{oProfile?.displayName}</span>
            <span style={{ color: 'grey' }}>@{oProfile?.name}</span>
            <span style={{ marginLeft: '20px' }}>{oProfile?.nip05}</span>
            <span style={{ marginLeft: '20px' }}>
              <a href={oProfile?.website} target="_blank" rel="noreferrer">
                {oProfile?.website}
              </a>
            </span>
          </div>
          <div style={{ color: 'grey', marginBottom: '12px' }}>
            {npub}{' '}
            <CIcon icon={cilClone} className="me-2" onClick={() => copyNpubToClipboard(npub)} />
          </div>
          <ContextualFollowBlockButtons rateeNpub={npub} />
        </div>
      </div>
      <CRow>
        <TabsNavigation updateWhichTab={setWhichTab} />
      </CRow>
      <CRow>
        <ProfileTabsContent whichTab={whichTab} npub={npub} pubkey={pubkey} oProfile={oProfile} />
      </CRow>
    </div>
  )
}

export default Profile
