import React, { useState, useEffect } from 'react'
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

const DefaultLayout = () => {
  const myNpub = useSelector((state) => state.profile.npub)
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myCurrentProfileKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)
  const myCurrentProfileKind3Relays = useSelector((state) => state.profile.kind3.relays)
  const myCurrentProfileKind3Follows = useSelector((state) => state.profile.kind3.follows)
  const [downloadedKind3Events, setDownloadedKind3Events] = useState([])
  const [downloadedCreatedAt, setDownloadedCreatedAt] = useState(0)
  const [aDownloadedFollowsUpdated, setADownloadedFollowsUpdated] = useState([])
  const [oDownloadedRelaysUpdated, setODownloadedRelaysUpdated] = useState([])

  const { getProfile, fetchEvents } = useNDK()

  const filter = {
    authors: [myPubkey],
    since: 0,
    kinds: [3],
  }

  useEffect(() => {
    async function updateMyFollowsAndRelays() {
      if (myPubkey) {
        const events = await fetchEvents(filter)
        setDownloadedKind3Events(events)
        events.forEach((event, item) => {
          const createdAt = event.created_at
          if (createdAt > myCurrentProfileKind3CreatedAt) {
            // update relays in my profile
            const content = event.content
            const oRelays = JSON.parse(content)
            setODownloadedRelaysUpdated(oRelays)

            // update follows in my profile
            let aTags_p = event.tags.filter(([k, v]) => k === 'p' && v && v !== '')
            const aFollows = []
            aTags_p.forEach((tag_p, item) => {
              if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
                const pk = tag_p[1]
                aFollows.push(pk)
              }
            })
            setADownloadedFollowsUpdated(aFollows)
            setDownloadedCreatedAt(createdAt)

            dispatch(updateKind3CreatedAt(createdAt))
            dispatch(updateRelays(oRelays))
            dispatch(updateFollows(aFollows))
          }
        })
      }
    }
    updateMyFollowsAndRelays()
  }, [fetchEvents(filter)])

  const dispatch = useDispatch()

  useEffect(() => {
    async function updateMyProfile() {
      if (myNpub) {
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
    updateMyProfile()
  }, [getProfile(myNpub)])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
