import React, { useEffect, useState, useMemo} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { ndk, ndk_brainstorm } from '../../../../helpers/ndk'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CButton , CProgress, CProgressStacked, CProgressBar} from '@coreui/react'
import { nip19 } from 'nostr-tools'
import {
  updateSignedIn,
  updateSignInMethod,
  updateNsec,
  updateHexKey,
  updateNpub,
  updatePubkey,
  processMyKind3Event, 
  updateMyProfile 
} from '../../../../redux/features/profile/slice'

import {
  updateDegreesOfSeparation,
  updateKind0Event,
  processKind3Event,
  processKind10000Event
} from 'src/redux/features/profiles/slice'
import { toggleIndividualListener } from '../../../../redux/features/settings/slice'

import { useSubscribe } from 'nostr-hooks'
import { makeEventSerializable } from '../../../../helpers/index'
import { defListener2 } from '../../../../const'



/**
 * adapted from helpers/profileListeners-nostr-hooks/
 */
const LoadEventsProgress = ({listener = 2, color="primary", maxValue=20, msg="", setNextProgress}) => {

  // every 10 events loaded gets 1 increment in progress bar untill max value.
  const progressIncrement = .1
  const [progressValue, setProgreessValue] = useState(0)
  const [numFollows, setNumFollows] = useState(0)

  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = useSelector((state) => state.profile.npub)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aMyFollows = oProfilesByNpub[myNpub] ? oProfilesByNpub[myNpub].follows : []

  // if we already have loaded myfollows, just return
  let doNotProcess = false
  if(listener == 2 && aMyFollows?.length ) {
    doNotProcess = true
  }

  // TODO support more listeners
  const authorList = listener == 2 ? [myPubkey]  : aMyFollows 
  console.log('LoadEventsProgress listener '+listener, authorList)

  const filters = React.useMemo(() => [{
    authors: authorList ,
    kinds: [0, 3, 10000],
  }], [])
  const { events, eose } = useSubscribe({ filters })

  const dispatch = useDispatch()

  async function processEventNS(eventNS){
    const event = makeEventSerializable(eventNS)
    console.log('processing event',event)
    if (event.kind == 0) {
      dispatch(updateKind0Event(event))
      if (event.pubkey == myPubkey) {
        const oMyProfile = JSON.parse(event.content)
        dispatch(updateMyProfile(oMyProfile))
        const npub_toUpdate = myNpub
        const degreesOfSeparation_new = 0
        dispatch(updateDegreesOfSeparation({ npub_toUpdate, degreesOfSeparation_new }))
      }
    }
    if (event.kind == 3) {
      dispatch(processKind3Event(event))
      if (event.pubkey == myPubkey) {
        dispatch(processMyKind3Event(event))
        setNumFollows(event.tags.length)
      }
    }
    if (event.kind == 10000) {
      dispatch(processKind10000Event(event))
    }
  }

  async function processAllEvents(events){
    events.forEach((eventNS, item) => {
      console.log('confirming local storage of event ' + item)
      console.log('num tags = ' + eventNS.tags.length)
      processEventNS(eventNS)
    })
  }

  // dispatch(toggleIndividualListener({ newState: 'show', num: listener }))

  useEffect(() => {
    if (events.length > 0 && !doNotProcess) {
      console.log('adding event ' + events.length + ' to local storage (redux)')
      const num = events.length - 1
      const eventNS = events[num]
      processEventNS(eventNS)
      const incrementedLength = Math.floor(events.length * progressIncrement) 
      setProgreessValue(incrementedLength < maxValue ? incrementedLength : progressValue)
    }else{
      setProgreessValue(maxValue)
    }
  }, [events])

  useEffect(() => {
    if (eose && !doNotProcess) {
      // dispatch(toggleIndividualListener({ newState: 'hide', num: listener }))
      // setSubState('EOSE reached, now storing in redux ...')
      // processAllEvents(events)
      setProgreessValue(maxValue)
      if(setNextProgress) setNextProgress(true)
    }
  }, [eose])

  if(doNotProcess){
    if(setNextProgress) setNextProgress(true)
      return (
        <CProgress color={color} value={maxValue}>
          <CProgressBar>+{aMyFollows.length} {msg}</CProgressBar>
        </CProgress>
      )   
  }
  return (
    <CProgress color={color} value={progressValue} variant={!eose ? "striped" : ""} animated>
      <CProgressBar>+{events.length} {msg}</CProgressBar>
    </CProgress>
  )
}


const ExportGrapevineList = () => {

  const [progressColor, setProgressColor] = useState("primary")
  const [progressMessage, setProgressMessage] = useState("")
  const [progressLogin, setProgressLogin] = useState("")
  const [startFirstHop, setStartFirstHop] = useState(false)
  const [progressFirstHop, setProgressFirstHop] = useState("")
  const [startSecondHop, setStartSecondHop] = useState(false)
  const [progressSecondHop, setProgressSecondHop] = useState("")
  const [progressPublishing, setProgressPublishing] = useState("")
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  let myPubkey = useSelector((state) => state.profile.pubkey)
  let isSignedIn = useSelector((state) => state.profile.signedIn)

  // const isSignedIn = useSelector((state) => state.profile.signedIn)
  const dispatch = useDispatch()
  const { loginWithNip07 } = useNDK()

  /**
   * from views/pages/login/Login.js
   */
  async function loginByExtension() {
    const user = await loginWithNip07()
    let pubkey = ''
    if (user) {
      const myNpub = user.user.npub
      // FIXIME is all this really needed just to get the pubkey? 
      // pubkey = user.signer.pubkey
      if(!pubkey){
        const decoded = nip19.decode(myNpub)
        if (decoded.type == 'npub') {
          pubkey = decoded.data
          dispatch(updatePubkey(pubkey))
          myPubkey = pubkey
        }  
      }
      dispatch(updateNpub(myNpub))
      dispatch(updateSignInMethod('extension'))
      dispatch(updateSignedIn(true))
      isSignedIn = true
    }
    return pubkey
  }

  /**
   * adapted from views/helloWorld/testPage7
   */
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  // const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  // const [oNdkEvent, setONdkEvent] = useState({})
  // const [numProfiles, setNumProfiles] = useState(0)
  // const [numTags, setNumTags] = useState(0)  
  const createEventKind30000 = async (whetherToPublish) => {
    console.log('page_7 loc B; num profils:' + Object.keys(oProfilesByPubkey).length)
    // const ndkEvent = new NDKEvent(ndk_brainstorm)
    const ndkEvent = new NDKEvent(ndk)
    ndkEvent.kind = 30000
    // const aTags = oEventDefault.tags
    const aTags = []
    Object.keys(oProfilesByPubkey).forEach((pubkey, item) => {
      const npub = nip19.npubEncode(pubkey)
      let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
      // if (influence > 0) {
        aTags.push(['p', pubkey, '', influence]) // third string is typically a relay url; currently it is empty string
      // }
    })
    console.log('page_7 loc C')
    const aTagsSorted = aTags.sort((a, b) => b[3] - a[3])
    const aTagsSortedTop1000 = []
    aTagsSorted.forEach((t, item) => {
      if (item < 1000) {
        aTagsSortedTop1000.push(t)
      }
    })
    console.log('page_7 loc D')
    // setNumProfiles(aTagsSortedTop1000.length)
    ndkEvent.tags = oEventDefault.tags.concat(aTagsSortedTop1000)
    // setNumTags(ndkEvent.tags.length)
    await ndkEvent.sign(signer)
    console.log('ndkEvent: ' + JSON.stringify(ndkEvent, null, 4))
    if (whetherToPublish) {
      console.log('List published! event id: ' + ndkEvent.id)
      await ndkEvent.publish()
      alert('List published! event id: ' + ndkEvent.id)
    }
    if (!whetherToPublish) {
      console.log('publish: NO')
      // setONdkEvent(ndkEvent)
    }
  }

  
  useEffect(() => {
    if (startFirstHop ) {
      setProgressMessage('Downloading my follows list...')
      setProgressColor('info')
      setProgressFirstHop((<LoadEventsProgress listener={2} color="info" msg="my follows" maxValue={30} setNextProgress={setStartSecondHop}/> ))
    }
  }, [startFirstHop])

  useEffect(() => {
    if (startSecondHop) {
      setProgressMessage('Downloading my follows follows...')
      setProgressColor('success')
      setProgressSecondHop((<LoadEventsProgress listener={4} color="success" msg="my follows follows" maxValue={50} /> ))
    }
  }, [startSecondHop])


  async function doExport(){
    // do signin
    if(!loading && !isSignedIn) {
      setProgressMessage('Signing into Nostr ...')
      setProgressColor('warning')
      setProgressLogin((
      <CProgress color="warning" value={10} variant={"striped"} animated>
        <CProgressBar>me</CProgressBar>
      </CProgress>))
      await loginByExtension();
    }
    if(!loading && isSignedIn){
      setProgressLogin((
      <CProgress color="warning" value={10}>
        <CProgressBar>me</CProgressBar>
      </CProgress>))
      if(!startFirstHop) setStartFirstHop(true)
      setLoading(true)
    }

  }

  return (
    <>
      <center>
        <h3>Export "Grapevine WoT" List</h3>
        <CButton color={progressColor}  className="my-3" active tabIndex={-1} 
          onClick={() => doExport()} disabled={loading}>
            {!loading ? 'Export to Nostr' : loaded ? 'Success!' : progressMessage }
        </CButton>
        <CProgressStacked>
          {progressLogin}
          {progressFirstHop}
          {progressSecondHop}
          {progressPublishing}
        </CProgressStacked>
      </center>

    </>
  )
}


export default ExportGrapevineList



