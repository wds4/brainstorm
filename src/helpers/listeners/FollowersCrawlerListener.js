import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19, validateEvent } from 'nostr-tools'
import { makeEventSerializable } from '..'
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
} from 'src/redux/features/profile/slice'
import {
  updateDegreesOfSeparationFromMe,
  updateKind0Event,
  updateKind3Event,
  processKind3Event,
} from 'src/redux/features/profiles/slice'

// TO DO: test
const FollowersCrawlerListenerMain = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const myCurrentProfileKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)
  const dispatch = useDispatch()

  const filter = {
    kinds: [0, 3],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateProfilesDatabase() {
      const events = await fetchEvents(filter)

      events.forEach((eventNS, item) => {
        // console.log('ProfilesDataListener; item: ' + item)
        try {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)
            if (event.kind == 0) {
              dispatch(updateKind0Event(event))
              if (event.pubkey == myPubkey) {
                const oMyProfile = JSON.parse(event.content)
                dispatch(updateDisplayName(oMyProfile?.displayName))
                dispatch(updateName(oMyProfile?.name))
                dispatch(updateAbout(oMyProfile?.about))
                dispatch(updateBanner(oMyProfile?.banner))
                if (oMyProfile?.image) {
                  dispatch(updatePicture(oMyProfile?.image))
                }
                if (oMyProfile?.picture) {
                  dispatch(updatePicture(oMyProfile?.picture))
                }
                dispatch(updateNip05(oMyProfile?.nip05))
                const npub_toUpdate = myNpub
                const degreesOfSeparationFromMe_new = 0
                dispatch(
                  updateDegreesOfSeparationFromMe({ npub_toUpdate, degreesOfSeparationFromMe_new }),
                )
              }
            }
            if (event.kind == 3) {
              // dispatch(updateKind3Event(event))
              dispatch(processKind3Event(event))
              if (event.pubkey == myPubkey) {
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
              }
            }
          }
        } catch (e) {
          console.log('updateProfilesDatabase error: ' + e)
        }
      })
    }
    updateProfilesDatabase()
  }, [fetchEvents(filter)])

  return <></>
}

const FollowersCrawlerListener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <FollowersCrawlerListenerMain />
  }
  return <></>
}

export default FollowersCrawlerListener
