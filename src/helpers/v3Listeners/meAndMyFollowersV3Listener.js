import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { nip19, validateEvent } from 'nostr-tools'
import { makeEventSerializable } from '..'
import { processKind10000Event } from '../../redux/features/profiles/slice'

const ListenerOn = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const myCurrentProfileKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)
  const dispatch = useDispatch()
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oMyProfile = oProfilesByNpub[myNpub]
  const aMyFollows = oMyProfile.follows
  const aPubkeys = []
  // only try to download follows that have not already been downloaded
  if (aMyFollows) {
    aMyFollows.forEach((pk) => {
      if (
        pk &&
        oProfilesByPubkey &&
        oProfilesByPubkey[pk] &&
        oProfilesByNpub[oProfilesByPubkey[pk]]
      ) {
        const oProf = oProfilesByNpub[oProfilesByPubkey[pk]]
        if (!oProf.kind0 || !oProf.kind3) {
          if (!aPubkeys.includes(pk)) {
            aPubkeys.push(pk)
          }
        }
      }
    })
  }
  // const aPubkeys = JSON.parse(JSON.stringify(aMyFollows))
  if (!aPubkeys.includes(myPubkey)) {
    aPubkeys.push(myPubkey)
  }

  const filter = {
    authors: aPubkeys,
    kinds: [0, 3, 10000],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateMyProfileDatabase() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        try {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)
            // console.log('updateMyProfileDatabase_kind: ' + event.kind)
            if (event.kind == 0) {
              dispatch(updateKind0Event(event))
              if (event.pubkey == myPubkey) {
                // console.log('updateMyProfileDatabase; my pubkey! myPubkey: ' + myPubkey)
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
                  if (aTags_p) {
                    aTags_p.forEach((tag_p, item) => {
                      if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
                        const pk = tag_p[1]
                        aFollows.push(pk)
                      }
                    })
                  }
                  dispatch(updateKind3CreatedAt(createdAt))
                  dispatch(updateRelays(oRelays))
                  dispatch(updateFollows(aFollows))
                }
              }
            }
            if (event.kind == 10000) {
              // console.log('updateMyProfileDatabase, myProfile; kind 10000')
              dispatch(processKind10000Event(event))
            }
          }
        } catch (e) {
          console.log('================================= updateMyProfileDatabase error: ' + e)
        }
      })
    }
    updateMyProfileDatabase()
  }, [fetchEvents(filter)])

  return <></>
  return (
    <>
      <div style={{ display: 'inline-block', border: '1px solid grey', padding: '2px' }}>
        My Profile Listener: On
      </div>
    </>
  )
}

const MeAndMyProfilesV3Listener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  const isSignedIn = useSelector((state) => state.profile.signedIn)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  if (myPubkey && isSignedIn) {
    return <ListenerOn />
  }

  return <></>
  return (
    <>
      <div style={{ display: 'inline-block', border: '1px solid grey', padding: '2px' }}>
        My Profile Listener: Off
      </div>
    </>
  )
}

export default MeAndMyProfilesV3Listener
