import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { updateViewProfileTab } from '../../redux/features/siteNavigation/slice'

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
  const currentDevelopmentMode = useSelector((state) => state.settings.general.developmentMode)
  const viewProfileTab = useSelector((state) => state.siteNavigation.profile.tab)
  const [whichTab, setWhichTab] = useState(viewProfileTab) // use names of apps: about, notes, leaveRating, ratingsOf, ratingsBy, wotScores
  const { getProfile } = useNDK()
  const npub = useSelector((state) => state.siteNavigation.npub)
  const oProfile = getProfile(npub)

  const dispatch = useDispatch()

  const pubkey = getPubkeyFromNpub(npub)

  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('user npub copied to clipboard: \n ' + np)
  }

  const updateWhichTab = (newTab) => {
    setWhichTab(newTab)
    dispatch(updateViewProfileTab(newTab))
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-5 profileAvatarContainer">
          <img src={oProfile?.image} className="profileAvatarLarge" />
        </div>
        <div className="col" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="col-auto" style={{ fontSize: '34px', overflowWrap: 'break-word' }}>{oProfile?.displayName}</div>
            <div className="col-auto" style={{ color: 'grey' }}>@{oProfile?.name}</div>
            <div className="col-auto">{oProfile?.nip05}</div>
            <div className="col">
              <a href={oProfile?.website} target="_blank" rel="noreferrer">
                {oProfile?.website}
              </a>
            </div>
          </div>
          <div style={{ color: 'grey', marginBottom: '12px', overflowWrap: 'break-word' }}>
            {npub}{' '}
            <CIcon icon={cilClone} className="me-2" onClick={() => copyNpubToClipboard(npub)} />
          </div>
          <div className={currentDevelopmentMode}>
            <ContextualFollowBlockButtons rateeNpub={npub} />
          </div>
        </div>
      </div>
      <br />
      <CRow>
        <TabsNavigation whichTab={whichTab} updateWhichTab={updateWhichTab} />
      </CRow>
      <br />
      <CRow>
        <ProfileTabsContent whichTab={whichTab} npub={npub} pubkey={pubkey} oProfile={oProfile} />
      </CRow>
      <br />
    </div>
  )
}

export default Profile

// <div style={{ display: 'flex', alignItems: 'center' }}>
