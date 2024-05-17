import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CButton, CCol, CContainer, CNav, CNavLink, CRow } from '@coreui/react'
import LeaveRating from './leaveRating/leaveTrustAttestation'
import TabsNavigation from './tabsNavigation'
import ContextualFollowBlockButtons from './contextualFollowBlockButtons/contextualFollowBlockButtons'
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import About from './about/About'
import Notes from './notes/notes'
import { getPubkeyFromNpub } from '../../helpers/nip19'
import Wikis from './wikis/Wikis'
import { updateApp, updateViewProfileTab } from '../../redux/features/siteNavigation/slice'
import Follows from './follows/Follows'
import {
  turnListenerOn,
  updateFilter,
  updateListenerApplication,
} from '../../redux/features/listenerManager/slice'
import { nip19 } from 'nostr-tools'
import ProfilesDataListener from '../../helpers/listeners/ProfilesDataListener'
import { getProfileBrainstormFromNpub } from '../../helpers/brainstorm'

const oProfileBlank = {
  banner: '',
  lud16: '',
  picture: '',
  lud06: '',
  website: '',
  about: '',
  name: '',
  display_name: '',
  nip05: '',
}
// eslint-disable-next-line react/prop-types
const ProfileTabsContent = ({
  whichTab,
  npub,
  pubkey,
  oProfile,
  oProfileNdk,
  oProfileBrainstorm,
  oKind0Event,
  oKind3Event,
  aFollowPubkeys,
  aFollowNpubs,
  updateWhichTab,
}) => {
  if (whichTab == 'about') {
    return (
      <About
        oKind0Event={oKind0Event}
        oKind3Event={oKind3Event}
        oProfile={oProfile}
        oProfileNdk={oProfileNdk}
        oProfileBrainstorm={oProfileBrainstorm}
        npub={npub}
        pubkey={pubkey}
        aFollowPubkeys={aFollowPubkeys}
      />
    )
  }
  if (whichTab == 'follows') {
    return (
      <Follows
        aFollowPubkeys={aFollowPubkeys}
        aFollowNpubs={aFollowNpubs}
        oKind3Event={oKind3Event}
        oProfile={oProfile}
        npub={npub}
        pubkey={pubkey}
        updateWhichTab={updateWhichTab}
      />
    )
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

const EditMyProfileButton = () => {
  const npubBeingObserved = useSelector((state) => state.siteNavigation.npub)
  const myNpub = useSelector((state) => state.profile.npub)
  if (npubBeingObserved == myNpub) {
    return (
      <CNavLink href="#/myProfile/editMyProfile">
        <CButton color="primary">Edit my profile</CButton>
      </CNavLink>
    )
  }
  return <></>
}

const Profile = () => {
  const npub = useSelector((state) => state.siteNavigation.npub)
  const pubkey = getPubkeyFromNpub(npub)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const currentDevelopmentMode = useSelector((state) => state.settings.general.developmentMode)
  const viewProfileTab = useSelector((state) => state.siteNavigation.profile.tab)
  // if (viewProfileTab == 'follows') { viewProfileTab == 'about' }
  const [whichTab, setWhichTab] = useState(viewProfileTab) // use names of apps: about, notes, leaveRating, ratingsOf, ratingsBy, wotScores

  const dispatch = useDispatch()

  let k0 = {}
  let k3 = {}
  const oProfileBrainstorm = getProfileBrainstormFromNpub(npub, oProfilesByNpub)
  /*
  let oProfileBrainstorm = oProfileBlank
  if (oProfilesByNpub[npub]) {
    const oThisProfile = oProfilesByNpub[npub]
    const k0 = oThisProfile.kind0.oEvent
    const k3 = oThisProfile.kind3.oEvent
    oProfileBrainstorm = oThisProfile
    if (
      oThisProfile &&
      oThisProfile.kind0 &&
      oThisProfile.kind0.oEvent &&
      oThisProfile.kind0.oEvent.content
    ) {
      oProfileBrainstorm = JSON.parse(oThisProfile.kind0.oEvent.content)
    }
  }
  */

  let degreesOfSeparationFromMe = 999
  let degreesOfSeparationFromMeText = 'unknown (not connected ?)'
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].wotScores) {
    degreesOfSeparationFromMe = oProfilesByNpub[npub].wotScores.degreesOfSeparationFromMe
    degreesOfSeparationFromMeText =
      degreesOfSeparationFromMe + ' degrees of separation (via follows)'
    if (degreesOfSeparationFromMe == 1) {
      degreesOfSeparationFromMeText =
        degreesOfSeparationFromMe + ' degree of separation (via follows)'
    }
    if (degreesOfSeparationFromMe == 0) {
      degreesOfSeparationFromMeText =
        degreesOfSeparationFromMe + ' degrees of separation (this is me!)'
    }
  }

  const [oKind0Event, setOKind0Event] = useState(k0)
  const [oKind3Event, setOKind3Event] = useState(k3)

  const aFollowPubkeys = []
  const aFollowNpubs = []
  if (oKind3Event && oKind3Event.tags) {
    const aTags = oKind3Event.tags
    aTags.forEach((aTag, item) => {
      if (aTag[0] == 'p') {
        const pk = aTag[1]
        aFollowPubkeys.push(pk)
        const np = nip19.npubEncode(pk)
        if (np) {
          aFollowNpubs.push(np)
        }
      }
    })
  }

  // manage listener part 1
  if (!oProfileBrainstorm || aFollowPubkeys.length == 0) {
    const filter = {
      kinds: [0, 3],
      authors: [pubkey],
      since: 0,
    }
    dispatch(updateApp('home'))
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
    dispatch(updateListenerApplication('home'))
  }

  let oProfileNdk = { message: 'did not fetch bc profile already in redux database' }
  const { getProfile } = useNDK()
  useEffect(() => {
    setOKind0Event({})
    setOKind3Event({})
    function updateEvents() {
      if (oProfilesByNpub[npub]) {
        const oProf = oProfilesByNpub[npub]
        const oKind0Event = oProf.kind0.oEvent
        const oKind3Event = oProf.kind3.oEvent
        if (oKind0Event) {
          setOKind0Event(oKind0Event)
        }
        if (oKind3Event) {
          setOKind3Event(oKind3Event)
        }
      } else {
        oProfileNdk = getProfile(npub)
      }
    }
    updateEvents()
  }, [oProfilesByNpub, npub])

  useEffect(() => {
    setWhichTab('about')
  }, [npub])

  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('user npub copied to clipboard: \n ' + np)
  }

  const updateWhichTab = (newTab) => {
    setWhichTab(newTab)
    dispatch(updateViewProfileTab(newTab))
  }

  // manage listener part 2
  // if kind0 and kind3 have already been downloaded, then switch to listening for follows info
  // but not if on wikis or twitter tabs, in which case need to download those things
  if (whichTab != 'wikis' && whichTab != 'notes') {
    if (oProfileBrainstorm && aFollowPubkeys && aFollowPubkeys.length > 0) {
      const filter = {
        kinds: [0, 3],
        authors: aFollowPubkeys,
        since: 0,
      }
      dispatch(updateApp('home'))
      dispatch(updateFilter(filter))
      dispatch(turnListenerOn())
      dispatch(updateListenerApplication('home'))
    }
  }
  if (whichTab == 'notes') {
    const filter = {
      kinds: [1],
      authors: [pubkey],
      since: 0,
    }
    dispatch(updateApp('home'))
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
    dispatch(updateListenerApplication('home'))
  }
  if (whichTab == 'follows') {
    // if main profile kind3 events have been downloaded, then switch listener to follower profiles
    if (aFollowPubkeys && aFollowPubkeys.length > 0) {
      const filter = {
        kinds: [0, 3],
        authors: aFollowPubkeys,
      }
      dispatch(updateApp('home'))
      dispatch(updateFilter(filter))
      dispatch(turnListenerOn())
      dispatch(updateListenerApplication('home'))
    }
  }
  // if profile info is not available, that takes precedence, but don't forget about wikis and follows
  if (oProfileBrainstorm.lastUpdated == 0) {
    const filter = {
      kinds: [0, 3],
      authors: [pubkey],
    }
    dispatch(updateApp('home'))
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
    dispatch(updateListenerApplication('home'))
  }

  return (
    <>
      <ProfilesDataListener aPubkeys={aFollowPubkeys} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-5 profileAvatarContainer">
            <img
              src={oProfileBrainstorm?.image || oProfileBrainstorm?.picture}
              className="profileAvatarLarge"
            />
          </div>
          <div className="col" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div className="col-auto" style={{ fontSize: '34px', overflowWrap: 'break-word' }}>
                {oProfileBrainstorm?.display_name}
              </div>
              <div className="col-auto" style={{ color: 'grey' }}>
                @{oProfileBrainstorm?.name}
              </div>
              <div className="col-auto">{oProfileBrainstorm?.nip05}</div>
              <div className="col">
                <a href={oProfileBrainstorm?.website} target="_blank" rel="noreferrer">
                  {oProfileBrainstorm?.website}
                </a>
              </div>
              <div className="col">
                <EditMyProfileButton />
              </div>
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'grey',
                marginBottom: '12px',
                overflowWrap: 'break-word',
              }}
            >
              {npub}{' '}
              <CIcon icon={cilClone} className="me-2" onClick={() => copyNpubToClipboard(npub)} />
            </div>
            <div className="d-flex gap-3">
              <div
                onClick={() => {
                  updateWhichTab('follows')
                }}
                style={{ display: 'inline-block' }}
              >
                {aFollowPubkeys.length} Follows
              </div>
              <div style={{ display: 'inline-block' }}>? Relays</div>
              <div style={{ display: 'inline-block' }}>{degreesOfSeparationFromMeText}</div>
            </div>
            <div className={currentDevelopmentMode} style={{ marginTop: '10px' }}>
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
          <ProfileTabsContent
            whichTab={whichTab}
            npub={npub}
            pubkey={pubkey}
            oProfile={oProfileBrainstorm}
            oProfileNdk={oProfileNdk}
            oProfileBrainstorm={oProfileBrainstorm}
            oKind0Event={oKind0Event}
            oKind3Event={oKind3Event}
            aFollowPubkeys={aFollowPubkeys}
            aFollowNpubs={aFollowNpubs}
            updateWhichTab={updateWhichTab}
          />
        </CRow>
        <br />
      </div>
    </>
  )
}

export default Profile
