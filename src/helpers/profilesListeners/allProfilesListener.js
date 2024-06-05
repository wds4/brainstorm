import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateDegreesOfSeparationFromMe,
  updateKind0Event,
  processKind3Event,
} from 'src/redux/features/profiles/slice'
import { nip19, validateEvent } from 'nostr-tools'
import { makeEventSerializable } from '..'
import { processKind10000Event } from '../../redux/features/profiles/slice'
import { processMyKind3Event, updateMyProfile } from '../../redux/features/profile/slice'
import { defListener4 } from 'src/const'

const ListenerOn = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const dispatch = useDispatch()

  const filter = {
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
            if (event.kind == 0) {
              dispatch(updateKind0Event(event))
              if (event.pubkey == myPubkey) {
                const oMyProfile = JSON.parse(event.content)
                dispatch(updateMyProfile(oMyProfile))
                const npub_toUpdate = myNpub
                const degreesOfSeparationFromMe_new = 0
                dispatch(
                  updateDegreesOfSeparationFromMe({ npub_toUpdate, degreesOfSeparationFromMe_new }),
                )
              }
            }
            if (event.kind == 3) {
              dispatch(processKind3Event(event))
              if (event.pubkey == myPubkey) {
                dispatch(processMyKind3Event(event))
              }
            }
            if (event.kind == 10000) {
              dispatch(processKind10000Event(event))
            }
          }
        } catch (e) {
          console.log('AllProfilesListener error: ' + e)
        }
      })
    }
    updateMyProfileDatabase()
  }, [fetchEvents(filter)])

  // return <></>
  return (
    <>
      <div style={{ display: 'inline-block', border: '1px solid grey', padding: '2px' }}>
        AllProfilesListener: On
      </div>
    </>
  )
}

const AllProfilesListener = () => {
  const isSignedIn = useSelector((state) => state.profile.signedIn)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  const generalSettings = useSelector((state) => state.settings.general)
  let currentListenerMode4 = defListener4
  if (generalSettings && generalSettings.listeners && generalSettings.listeners) {
    currentListenerMode4 = generalSettings.listeners.listener4
  }

  if (myPubkey && isSignedIn && currentListenerMode4 == 'show') {
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

export default AllProfilesListener
