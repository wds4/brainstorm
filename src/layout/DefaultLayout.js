import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import {
  updateAbout,
  updateBanner,
  updateDisplayName,
  updateName,
  updateNip05,
  updatePicture,
} from '../redux/features/profile/slice'
import MyProfileListener from '../helpers/profilesListeners-nostr-hooks/myProfileListener'
import MeAndMyFollowsListener from '../helpers/profilesListeners-nostr-hooks/meAndMyFollowsListener'
import AllProfilesListener from '../helpers/profilesListeners-nostr-hooks/allProfilesListener'
import WikiAuthorsListener from '../helpers/profilesListeners-nostr-hooks/wikiAuthorsListener'
import WikiLikesListener from '../helpers/listeners-ndk/WikiLikesListener'

const DefaultLayout = () => {
  const dispatch = useDispatch()

  const isSignedIn = useSelector((state) => state.profile.signedIn)
  const myKind0Event = useSelector((state) => state.profile.kind0.oEvent)
  const myNpub = useSelector((state) => state.profile.npub)

  const { getProfile } = useNDK()

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
  }, [myNpub])

  return (
    <>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <MyProfileListener />
          <MeAndMyFollowsListener />
          <AllProfilesListener />
          <WikiAuthorsListener />
          <WikiLikesListener />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
