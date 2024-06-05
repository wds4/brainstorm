import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CButton, CNavLink, CRow } from '@coreui/react'
import TabsNavigation from './tabsNavigation'
import ContextualFollowBlockButtons from './contextualFollowBlockButtons/contextualFollowBlockButtons'
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import { getPubkeyFromNpub } from '../../helpers/nip19'
import { updateApp, updateViewProfileTab } from '../../redux/features/siteNavigation/slice'
import {
  turnListenerOn,
  updateFilter,
  updateListenerApplication,
} from '../../redux/features/listenerManager/slice'
import { getProfileBrainstormFromNpub, returnDegreesOfSeparation } from '../../helpers/brainstorm'
import { updateDegreesOfSeparationFromMe } from '../../redux/features/profiles/slice'
import TabsContent from './tabsContent'
import SingleProfileListener from '../../helpers/profilesListeners/singleProfileListener'

const EditMyProfileButton = () => {
  const npubBeingObserved = useSelector((state) => state.siteNavigation.npub)
  const myNpub = useSelector((state) => state.profile.npub)
  if (npubBeingObserved == myNpub) {
    return (
      <CNavLink href="#/profile/editMyProfile">
        <CButton color="primary">Edit my profile</CButton>
      </CNavLink>
    )
  }
  return <></>
}

const ShowMyNsecButton = ({ setRevealSecret }) => {
  const npubBeingObserved = useSelector((state) => state.siteNavigation.npub)
  const myNpub = useSelector((state) => state.profile.npub)
  const signInMethod = useSelector((state) => state.profile.signInMethod)
  if (npubBeingObserved == myNpub) {
    if (signInMethod == 'secret') {
      return (
        <CButton color="danger" onClick={() => setRevealSecret('yes')}>
          Show my nsec
        </CButton>
      )
    }
  }
  return <></>
}

const MyNsec = ({ revealSecret }) => {
  const npubBeingObserved = useSelector((state) => state.siteNavigation.npub)
  const myNpub = useSelector((state) => state.profile.npub)
  const myNsec = useSelector((state) => state.profile.nsec)
  const signInMethod = useSelector((state) => state.profile.signInMethod)
  const copyNsecToClipboard = (ns) => {
    navigator.clipboard.writeText(ns)
    alert('user npub copied to clipboard: \n ' + ns)
  }
  if (revealSecret == 'yes') {
    if (npubBeingObserved == myNpub) {
      if (signInMethod == 'secret') {
        return (
          <div
            style={{
              fontSize: '10px',
              color: 'grey',
              marginBottom: '12px',
              overflowWrap: 'break-word',
            }}
          >
            {myNsec}{' '}
            <CIcon icon={cilClone} className="me-2" onClick={() => copyNsecToClipboard(myNsec)} />
          </div>
        )
      }
    }
  }
  return <></>
}

const Profile = () => {
  const myNpub = useSelector((state) => state.profile.npub)
  // info for this profile
  const npub = useSelector((state) => state.siteNavigation.npub)
  const pubkey = getPubkeyFromNpub(npub)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  let aFollowPubkeys = []
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].follows) {
    aFollowPubkeys = oProfilesByNpub[npub].follows
  }
  const currentDevelopmentMode = useSelector((state) => state.settings.general.developmentMode)
  const viewProfileTab = useSelector((state) => state.siteNavigation.profile.tab)
  // if (viewProfileTab == 'follows') { viewProfileTab == 'about' }
  // const [whichTab, setWhichTab] = useState(viewProfileTab) // use names of apps: about, notes, leaveRating, ratingsOf, ratingsBy, wotScores
  const [whichTab, setWhichTab] = useState('about')

  const dispatch = useDispatch()

  const oProfileBrainstorm = getProfileBrainstormFromNpub(npub, oProfilesByNpub)

  let degreesOfSeparationFromMe = 999
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].wotScores) {
    degreesOfSeparationFromMe = oProfilesByNpub[npub].wotScores.degreesOfSeparationFromMe
  }

  // let dosScore = 0
  const dosScore = returnDegreesOfSeparation(pubkey, oProfilesByNpub, oProfilesByPubkey)
  if (degreesOfSeparationFromMe != dosScore) {
    let oNew = {}
    oNew.npub_toUpdate = npub
    oNew.degreesOfSeparationFromMe_new = dosScore
    dispatch(updateDegreesOfSeparationFromMe(oNew))
  }

  let degreesOfSeparationFromMeText = '? hops'
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].wotScores) {
    degreesOfSeparationFromMeText = degreesOfSeparationFromMe + ' hops'
    if (degreesOfSeparationFromMe == 1) {
      degreesOfSeparationFromMeText = degreesOfSeparationFromMe + ' hop'
    }
    if (degreesOfSeparationFromMe == 0) {
      degreesOfSeparationFromMeText = degreesOfSeparationFromMe + ' hops'
    }
  }

  const [revealSecret, setRevealSecret] = useState('no')

  const [oKind0Event, setOKind0Event] = useState({})
  const [oKind3Event, setOKind3Event] = useState({})
  const [oKind10000Event, setOKind10000Event] = useState({})

  const aFollowPubkeysB = []
  if (oKind3Event && oKind3Event.tags) {
    const aTags = oKind3Event.tags
    aTags.forEach((aTag, item) => {
      if (aTag[0] == 'p') {
        const pk = aTag[1]
        aFollowPubkeysB.push(pk)
      }
    })
  }

  const aFollowNpubs = []
  aFollowPubkeys.forEach((pk) => {
    if (oProfilesByPubkey[pk]) {
      aFollowNpubs.push(oProfilesByPubkey[pk])
    }
  })

  // * manage listener part 1
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod != 'off') {
    if (!oProfileBrainstorm || aFollowPubkeys.length == 0) {
      const filter = {
        kinds: [0, 3],
        authors: [pubkey],
      }
      dispatch(updateApp('home'))
      dispatch(updateFilter(filter))
      dispatch(turnListenerOn())
      dispatch(updateListenerApplication('home'))
    }
  }

  let oProfileNdk = { message: 'did not fetch bc profile already in redux database' }
  const { getProfile } = useNDK()
  useEffect(() => {
    setOKind0Event({})
    setOKind3Event({})
    setOKind10000Event({})
    function updateEvents() {
      if (oProfilesByNpub[npub]) {
        const oProf = oProfilesByNpub[npub]
        const oKind0Event = oProf.kind0.oEvent
        const oKind3Event = oProf.kind3.oEvent
        const oKind10000Event = oProf.kind10000.oEvent
        if (oKind0Event) {
          setOKind0Event(oKind0Event)
        }
        if (oKind3Event) {
          setOKind3Event(oKind3Event)
        }
        if (oKind10000Event) {
          setOKind10000Event(oKind10000Event)
        }
      } else {
        oProfileNdk = getProfile(npub)
      }
    }
    updateEvents()
  }, [oProfilesByNpub, npub])

  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('user npub copied to clipboard: \n ' + np)
  }

  const updateWhichTab = (newTab) => {
    setWhichTab(newTab)
    dispatch(updateViewProfileTab(newTab))
  }

  return (
    <>
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
              <div className="col">
                <ShowMyNsecButton setRevealSecret={setRevealSecret} />
              </div>
            </div>
            <MyNsec revealSecret={revealSecret} />
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
            <div className="d-flex flex-column flex-sm-row gap-5">
              <div
                onClick={() => {
                  updateWhichTab('follows')
                }}
                style={{ display: 'inline-block', textAlign: 'center' }}
              >
                {aFollowPubkeysB.length} Follows
              </div>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                {oProfileBrainstorm.followers.length} Followers
              </div>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>{oProfileBrainstorm.mutes.length} Mutes</div>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                Muted by {oProfileBrainstorm.mutedBy.length}
              </div>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                WoT Score: {oProfileBrainstorm.wotScores.coracle}
              </div>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>{degreesOfSeparationFromMeText}</div>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                Influence score: {oProfileBrainstorm.wotScores.baselineInfluence.influence}
              </div>
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
          <TabsContent
            whichTab={whichTab}
            npub={npub}
            pubkey={pubkey}
            oProfile={oProfileBrainstorm}
            oProfileNdk={oProfileNdk}
            oProfileBrainstorm={oProfileBrainstorm}
            oKind0Event={oKind0Event}
            oKind3Event={oKind3Event}
            oKind10000Event={oKind10000Event}
            aFollowPubkeys={aFollowPubkeysB}
            aFollowNpubs={aFollowNpubs}
            updateWhichTab={updateWhichTab}
            oProfilesByNpub={oProfilesByNpub}
          />
        </CRow>
        <br />
      </div>
      <SingleProfileListener />
    </>
  )
}

export default Profile
