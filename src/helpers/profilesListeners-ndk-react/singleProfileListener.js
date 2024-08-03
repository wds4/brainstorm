import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateDegreesOfSeparation,
  updateKind0Event,
  processKind3Event,
} from 'src/redux/features/profiles/slice'
import { nip19, validateEvent } from 'nostr-tools'
import { makeEventSerializable } from '..'
import { processKind10000Event } from '../../redux/features/profiles/slice'
import { getPubkeyFromNpub } from '../nip19'
import { processMyKind3Event, updateMyProfile } from '../../redux/features/profile/slice'
import { defListener3 } from '../../const'

const ListenerOn = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const dispatch = useDispatch()

  const npub = useSelector((state) => state.siteNavigation.npub)
  const pubkey = getPubkeyFromNpub(npub)

  const filter = {
    authors: [pubkey],
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
                const degreesOfSeparation_new = 0
                dispatch(
                  updateDegreesOfSeparation({ npub_toUpdate, degreesOfSeparation_new }),
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
          console.log(e)
        }
      })
    }
    updateMyProfileDatabase()
  }, [fetchEvents(filter)])

  return <></>
}

const SingleProfileListener = () => {
  const generalSettings = useSelector((state) => state.settings.general)
  let currentListenerMode3 = defListener3
  if (generalSettings && generalSettings.listeners && generalSettings.listeners) {
    currentListenerMode3 = generalSettings.listeners.listener3
  }

  if (currentListenerMode3 == 'show') {
    return <ListenerOn />
  }

  return <></>
}

export default SingleProfileListener
