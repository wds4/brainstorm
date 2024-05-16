import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import {
  updateAbout,
  updateBanner,
  updateDisplayName,
  updateFollows,
  updateKind3CreatedAt,
  updateName,
  updateNip05,
  updatePicture,
  updateRelays,
} from '../redux/features/profile/slice'
import ListenerManager from './ListenerManager'
import { updateApp } from '../redux/features/siteNavigation/slice'
import {
  turnListenerOn,
  updateFilter,
  updateListenerApplication,
} from '../redux/features/listenerManager/slice'
import { listenerMethod } from '../const'

const ShowListenerManagerOrNot = () => {
  const showListenerManager = useSelector((state) => state.settings.general.showListenerManager)
  if (listenerMethod == 'individualListeners') {
    return <></>
  }
  if (showListenerManager == 'hide') {
    return (
      <div style={{ display: 'none' }}>
        <ListenerManager />
      </div>
    )
  }
  if (showListenerManager == 'show') {
    return <ListenerManager />
  }
  return <></>
}

const DefaultLayout = () => {
  const dispatch = useDispatch()

  const loginTime = useSelector((state) => state.siteNavigation.loginTime)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfile = useSelector((state) => state.profile)
  const isSignedIn = useSelector((state) => state.profile.signedIn)
  const myKind0Event = useSelector((state) => state.profile.kind0.oEvent)
  const myKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)
  const myNpub = useSelector((state) => state.profile.npub)
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myCurrentProfileKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)

  // manage listener
  // dispatch(updateApp('home'))
  // dispatch(updateListenerApplication('home'))
  if (isSignedIn) {
    if (!oProfilesByNpub[myNpub]) {
      const filter = {
        authors: [myPubkey],
        since: 0,
        kinds: [0, 3],
      }
      dispatch(updateFilter(filter))
      dispatch(turnListenerOn())
    }
    if (oProfilesByNpub[myNpub]) {
      if (!oProfilesByNpub[myNpub].kind0 && !oProfilesByNpub[myNpub].kind3) {
        const filter = {
          authors: [myPubkey],
          since: 0,
          kinds: [0, 3],
        }
        dispatch(updateFilter(filter))
        dispatch(turnListenerOn())
      }
      if (!oProfilesByNpub[myNpub].kind0 && oProfilesByNpub[myNpub].kind3) {
        const filter = {
          authors: [myPubkey],
          since: 0,
          kinds: [0],
        }
        dispatch(updateFilter(filter))
        dispatch(turnListenerOn())
      }
      if (oProfilesByNpub[myNpub].kind0 && !oProfilesByNpub[myNpub].kind3) {
        const filter = {
          authors: [myPubkey],
          since: 0,
          kinds: [3],
        }
        dispatch(updateFilter(filter))
        dispatch(turnListenerOn())
      }
    }
  }
  if (!isSignedIn) {
    // listen for wikis
    /*
    const filter = {
      kinds: [30818],
      since: 0,
    }
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
    */
  }

  const { getProfile, fetchEvents } = useNDK()

  useEffect(() => {
    async function updateMyProfile() {
      if (isSignedIn && myNpub) {
        if (!myKind0Event.created_at) {
          const oMyProfile = getProfile(myNpub)
          dispatch(updateDisplayName(oMyProfile?.displayName))
          dispatch(updateName(oMyProfile?.name))
          dispatch(updateAbout(oMyProfile?.about))
          dispatch(updateBanner(oMyProfile?.banner))
          if (oMyProfile?.image) {
            dispatch(updatePicture(oMyProfile?.image))
          }
          dispatch(updateNip05(oMyProfile?.nip05))
        }
      }
    }
    updateMyProfile()
  }, [getProfile(myNpub)])

  /*
  const filter = {
    authors: [myPubkey],
    since: 0,
    kinds: [3],
  }

  useEffect(() => {
    async function updateMyFollowsAndRelays() {
      if (myPubkey) {
        const events = await fetchEvents(filter)
        events.forEach((event, item) => {
          const createdAt = event.created_at
          if (createdAt > myCurrentProfileKind3CreatedAt) {
            // update relays in my profile
            const content = event.content
            const oRelays = JSON.parse(content)

            // update follows in my profile
            let aTags_p = event.tags.filter(([k, v]) => k === 'p' && v && v !== '')
            const aFollows = []
            aTags_p.forEach((tag_p, item) => {
              if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
                const pk = tag_p[1]
                aFollows.push(pk)
              }
            })
            dispatch(updateKind3CreatedAt(createdAt))
            dispatch(updateRelays(oRelays))
            dispatch(updateFollows(aFollows))

          }
        })
      }
    }
    updateMyFollowsAndRelays()
  }, [fetchEvents(filter)])
  */

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <ShowListenerManagerOrNot />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
