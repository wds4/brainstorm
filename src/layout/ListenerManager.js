import { CRow } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateDegreesOfSeparationFromMe,
  updateKind0Event,
  updateKind3Event,
  processKind3Event,
} from '../redux/features/profiles/slice'
import { addArticle, addCategory } from '../redux/features/wikifreedia/slice'
import { processKind1Event } from '../redux/features/twittr/slice'
import { nip19, validateEvent } from 'nostr-tools'
import { fetchFirstByTag, makeEventSerializable } from '../helpers/index'
import { turnListenerOff, turnListenerOn } from '../redux/features/listenerManager/slice'
import { addAction, addContext, addTrustAttestation } from '../redux/features/grapevine/slice'
import { updateConceptGraphSettingsEvent } from '../redux/features/settings/slice'
import { addWordToConceptGraph } from '../redux/features/conceptGraph/slice'
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

const RunningListener = ({ oListenerManager }) => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const myCurrentProfileKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)
  const { fetchEvents } = useNDK()
  const dispatch = useDispatch()
  const [oEvents, setOEvents] = useState([])
  const [whenLastUpdated, setWhenLastUpdated] = useState(0)

  const filter = oListenerManager.filter

  // use ndk-react
  useEffect(() => {
    async function updateDatabase() {
      const events = await fetchEvents(filter)
      setOEvents(events)
      const currentTime = Math.floor(Date.now() / 1000)
      setWhenLastUpdated(currentTime)

      events.forEach((eventNS, item) => {
        try {
          if (validateEvent(eventNS)) {
            const event = makeEventSerializable(eventNS)

            // profile listeners
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

            // wiki listener
            if (event.kind == 30818) {
              dispatch(addArticle(event))
            }

            // twittr listener
            if (event.kind == 1) {
              dispatch(processKind1Event(event))
            }

            // grapevine listener, concept graph listener, nested lists
            if (event.kind == 9902 || event.kind == 37069 || event.kind == 39902) {
              const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
              if (aTags_w.length > 0) {
                let cid = event.id
                const wordType = aTags_w[0][1]
                // console.log('fetchEvents; wordType: ' + wordType)
                if (event.kind >= 30000 && event.kind < 40000) {
                  const tag_d = fetchFirstByTag('d', event)
                  const naddr = nip19.naddrEncode({
                    pubkey: event.pubkey,
                    kind: event.kind,
                    identifier: tag_d,
                    relays: [],
                  })
                  cid = naddr
                }
                // add to grapevine store
                if (wordType == 'action') {
                  dispatch(addAction({ event, cid }))
                }
                if (wordType == 'category') {
                  dispatch(addCategory({ event, cid }))
                }
                if (wordType == 'context') {
                  dispatch(addContext({ event, cid }))
                }
                if (wordType == 'trustAttestation') {
                  dispatch(addTrustAttestation({ event, cid }))
                }
                // add to settings store
                if (wordType == 'conceptGraphSettings') {
                  const pk = event.pubkey
                  if (pk == myPubkey) {
                    dispatch(updateConceptGraphSettingsEvent({ event }))
                  }
                }
                // add to conceptGraph store
                if (event && cid && wordType) {
                  dispatch(addWordToConceptGraph({ event, cid, wordType }))
                }
                /*
                if (wordType == 'wordType' || wordType == 'relationshipType') {
                  const aTags_nameSingular = event.tags.filter(
                    ([k, v]) => k === 'nameSingular' && v && v !== '',
                  )
                  const nameSingular = aTags_nameSingular[0][1]
                  // console.log('fetchEvents_wordType; nameSingular: ' + nameSingular)
                  dispatch(addWordToConceptGraph({ event, cid, wordType }))
                }
                */
                // will add to misc other apps (not yet implemented)
                if (wordType == 'nestedList') {
                  // console.log('fetchEvents_nestedList')
                }
              }
            }
          }
        } catch (e) {
          console.log('updateWikifreediaDatabase error: ' + e)
        }
      })
    }
    updateDatabase()
  }, [fetchEvents(filter)])

  const turnListenerOffButton = () => {
    console.log('turnListenerOffButton')
    dispatch(turnListenerOff())
  }

  return (
    <>
      <div>
        LISTENER: <span style={{ color: 'green' }}>ON</span> application:{' '}
        <div
          style={{ display: 'inline-block', color: 'white', backgroundColor: 'grey' }}
          onClick={() => {
            turnListenerOffButton()
          }}
        >
          turn listener OFF
        </div>
        <br />
        <div>current app: {oListenerManager.application}</div>
        <span style={{ float: 'right' }}>
          whenLastUpdated: {whenLastUpdated}{' '}
          <span style={{ marginLeft: '5px' }}>number of events: {oEvents.length}</span>
        </span>
      </div>
    </>
  )
}

const StatusReports = ({ oListenerManager }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oWikisByEventId = useSelector((state) => state.wikifreedia.articles.byEventId)
  const oTweets = useSelector((state) => state.twittr.mainFeed.events)
  const siteNavApp = useSelector((state) => state.siteNavigation.app)
  const oWordsByCid = useSelector((state) => state.conceptGraph.words)
  const filter = oListenerManager.filter
  return (
    <>
      <div>filter: {JSON.stringify(filter)}</div>
      <div>
        <span style={{ marginLeft: '5px' }}>siteNavApp: {siteNavApp}</span>
        <span style={{ marginLeft: '5px' }}>
          num profiles: {Object.keys(oProfilesByNpub).length}
        </span>
        <span style={{ marginLeft: '5px' }}>
          num wiki eventIds: {Object.keys(oWikisByEventId).length}
        </span>
        <span style={{ marginLeft: '5px' }}>num tweets: {Object.keys(oTweets).length}</span>
        <span style={{ marginLeft: '5px' }}>num words: {Object.keys(oWordsByCid).length}</span>
      </div>
    </>
  )
}

const SelectContent = () => {
  const oListenerManager = useSelector((state) => state.listenerManager)
  const dispatch = useDispatch()
  const listening = oListenerManager.listening
  if (listening) {
    return (
      <>
        <RunningListener oListenerManager={oListenerManager} />
        <StatusReports oListenerManager={oListenerManager} />
      </>
    )
  }
  const turnListenerOnButton = () => {
    dispatch(turnListenerOn())
  }
  return (
    <>
      <div>
        LISTENER: <span style={{ color: 'red' }}>OFF</span> application:{' '}
        <div
          style={{ display: 'inline-block', color: 'white', backgroundColor: 'grey' }}
          onClick={() => {
            turnListenerOnButton()
          }}
        >
          turn listener ON
        </div>
        <br />
        <div>current app: {oListenerManager.application}</div>
      </div>
      <StatusReports oListenerManager={oListenerManager} />
    </>
  )
}

const ListenerManager = () => {
  return (
    <>
      <div
        style={{ border: '1px solid grey', padding: '2px', height: '100px', overflow: 'scroll' }}
      >
        <SelectContent />
      </div>
    </>
  )
}

export default ListenerManager
