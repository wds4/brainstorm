import React, { useEffect, useState, useMemo} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { ndk, ndk_brainstorm } from '../../../../helpers/ndk'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CButton , CProgress, CProgressStacked, CProgressBar, CCollapse, CCard, CCardBody} from '@coreui/react'
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
import MyProfile from "src/views/myProfile/myProfile/MyProfile"
import InfluenceCalculations from "src/views/grapevine/scoreCalculations/influenceScores/influenceCalculations"
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
const LoadEventsProgress = ({listener = 2, color="primary", maxValue=20, msg="", setNextProgress, setMyProfile}) => {

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
        if(setMyProfile) setMyProfile(oMyProfile)
        const npub_toUpdate = myNpub
        const degreesOfSeparation_new = 0
        dispatch(updateDegreesOfSeparation({ npub_toUpdate, degreesOfSeparation_new }))
      }
    }
    if (event.kind == 3) {
      dispatch(processKind3Event(event))
      if (event.pubkey == myPubkey) {
        dispatch(processMyKind3Event(event))
      }
      setNumFollows(numFollows + event.tags.length)
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
      if(setNextProgress) setNextProgress(true)
      processAllEvents(events)
      setProgreessValue(maxValue)
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
      <CProgressBar>+{numFollows} {msg}</CProgressBar>
    </CProgress>
  )
}

/**
 * adapted from views/helloWorld/testPage7
 */
const CreateEventKind30000 = () => {
  const eventTitle = "My Grapevine Recomended Follows" 
  const eventDescription = "a list of nostr npubs and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol"
  const oEventDefault = {
    content: '',
    kind: 30000,
    tags: [
      ['P', 'tapestry'],
      ['wordType', 'influenceScoresList'],
      ['w', 'influenceScoresList'],
      ['d', 'influenceScoresList'],
      ['title', eventTitle],
      [ 'description', eventDescription ],
      ['c', ''],
    ],
    created_at: null,
  }
  const signer = new NDKNip07Signer()
  const myNpub = useSelector((state) => state.profile.npub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aMyFollows = oProfilesByNpub[myNpub] ? oProfilesByNpub[myNpub].follows : []
  const myPictureUrl = useSelector((state) => state.profile.picture)
  const [eventVisible, setEventVisible] = useState(false)
  console.log('page_7 loc B; num profils:' + Object.keys(oProfilesByPubkey).length)
  const ndkEvent = new NDKEvent(ndk)
  ndkEvent.kind = 30000
  const aTags = []
  Object.keys(oProfilesByPubkey).forEach((pubkey, item) => {
    const npub = nip19.npubEncode(pubkey)
    let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
    if (influence > 0 && !aMyFollows[npub]) {
      aTags.push(['p', pubkey, '', influence]) // third string is typically a relay url; currently it is empty string
    }
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
  ndkEvent.sign(signer)
  const eventString = JSON.stringify(ndkEvent.rawEvent(), null, 4)
  console.log('ndkEvent: ' + eventString)
  // if (whetherToPublish) {
  //   console.log('List published! event id: ' + ndkEvent.id)
  //   await ndkEvent.publish()
  //   alert('List published! event id: ' + ndkEvent.id)
  // }
  // if (!whetherToPublish) {
  //   console.log('publish: NO')
  //   // setONdkEvent(ndkEvent)
  // }
  return (
    <div>
      <center class="px-5">
        <p><small style={{color:"#666"}}>Grapevine found {aTagsSorted.length} quality npubs in your network which you do not currently follow. 
          Here are the top {aTagsSortedTop1000.length} reccomendations for you.</small></p>
        <div class="card mx-5 p-2">
          <h3>{eventTitle}</h3>
          <p>{eventDescription}</p>
          <CButton color="primary"  className="my-3" active onClick={() => ndkEvent.publish()}>
            Publish To Nostr
          </CButton>
          <CButton color="secondary" onClick={() => setEventVisible(!eventVisible)}>
            {eventVisible ? "Hide" : "View"} Raw Event
          </CButton>
        </div>
      </center>
      <CCollapse visible={eventVisible}>
        {/* <CCard className="mt-3">
          <CCardBody> */}
          <pre class="text-left mx-3">{eventString}</pre> 
          {/* </CCardBody>
        </CCard> */}
      </CCollapse>
    </div>
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
  const [refreshNotice, setRefreshNotice] = useState("")
  const [startCalculating, setStartCalculating] = useState(false)
  const [progressCalculating, setProgressCalculating] = useState("")
  const [influenceScore, setInfluenceScore] = useState("")
  const [endCalculating, setEndCalculating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [grapevineListOutput, setGrapevineListOutput] = useState("")
  const [oMyProfile, setOMyProfile] = useState({})
  const [userProfileDisplay, setUserProfileDisplay] = useState("")
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

  
  useEffect(() => {
    if (startFirstHop ) {
      setProgressMessage('Downloading my follows list...')
      setProgressColor('info')
      setProgressFirstHop((<LoadEventsProgress listener={2} color="info" msg="my follows" maxValue={30} setNextProgress={setStartSecondHop} setMyProfile={setOMyProfile}/> ))
    }
  }, [startFirstHop])

  useEffect(() => {
    if (startSecondHop) {
      setProgressMessage('Downloading my follows follows...')
      setProgressColor('success')
      setProgressSecondHop((
      <LoadEventsProgress listener={4} color="success" msg="my follows follows" maxValue={45} setNextProgress={setStartCalculating}/> 
      ))
      setRefreshNotice(
        <p class="mt-2"><small style={{color:"#666"}}>
        If progress stalls at 0, try again after refreshing the page. <br/>It should work the seciond time.</small></p>
      )
    }
  }, [startSecondHop])
  
  useEffect(()=>{
    if(startCalculating){
      setRefreshNotice("")
      setProgressMessage('Calculating Grapevine Score')
      setProgressColor('warning')
      setInfluenceScore(<InfluenceCalculations setCalculatingComplete={setEndCalculating}/>)
      setProgressCalculating(
        <CProgress color="warning" value={10} variant={"striped"} animated>
          <CProgressBar>calc</CProgressBar>
        </CProgress>
      )
    }
  } ,[startCalculating])

  useEffect(()=>{
    if(endCalculating){
      setProgressCalculating(
        <CProgress color="warning" value={15}>
          <CProgressBar>done</CProgressBar>
        </CProgress>
      )
      setGrapevineListOutput(
        <CreateEventKind30000/>
      )
      setProgressMessage('Publish Event')
      setProgressColor('base-100')
      setLoaded(true)
    }
  } ,[endCalculating])

  useEffect(()=>{
    if(oMyProfile?.npub){
      setUserProfileDisplay(
    // from Profile.js
    <div className="container-fluid">
      <div className="row">
        <div className="col-5 profileAvatarContainer">
          <img src={oMyProfile?.picture} className="profileAvatarLarge" />
        </div>
        <div className="col" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="col-auto" style={{ fontSize: '34px', overflowWrap: 'break-word' }}>
              {oMyProfile?.display_name}
            </div>
            <div className="col-auto" style={{ color: 'grey' }}>
              @{oMyProfile?.name}
            </div>
            <div className="col-auto">{oMyProfile?.nip05}</div>
            <div className="col">
              <a href={oMyProfile?.website} target="_blank" rel="noreferrer">
                {oMyProfile?.website}
              </a>
            </div>
          </div>
          <div style={{ color: 'grey', marginBottom: '12px', overflowWrap: 'break-word' }}>
            {oMyProfile?.npub}{' '}
            <CIcon
              icon={cilClone}
              className="me-2"
              // onClick={() => copyNpubToClipboard(oMyProfile?.npub)}
            />
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>      
    )
    }
  } ,[oMyProfile])


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
      <div class="py-2 px-3 w-full bg-primary text-sm">
        <a href="/">&lt; Brainstorm Ninja</a>
      </div>
      <center class="p-5 gap-5">
        <h2>My Grapevine Web Of Trust</h2>
        <p><strong>Discover interesting Nostriches<br/>from your follows follows.</strong></p>
        <p>Our basic Grapevine WoT feed is MORE interesting than your typical trending feed, 
          because the <a href="https://brainstorm.ninja/#/grapevine/influenceScore" target="_blank">Grapevine protocol</a> is
          able to discovesetLoadedr REAL people (weeding out bots and bad actors) 
          WITHOUT resorting to a popularity contest of "most followed npubs".</p>

          <h4><strong>Try it now.</strong></h4>
          <ol>
            <li>Use the button bellow to create and publish a Nostr list of "Grapevine Reccomended" 
          npubs.</li>
            <li>Go to your favorite 
            (<a href="https://github.com/nostr-protocol/nips/blob/master/51.md" target="_blank">NIP-51</a> supported *) Nostr client
             and use this list as a custom feed to discover new and interesting follows.</li>
          </ol>

          <p><small>
            (* These Nostr clients scurrently support custom feeds :<br/><a href="https://coracle.social" target="_blank">Coracle</a> (web)
            , <a href="https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst" target="_blank">Amethyst</a> (android)
            , <a href="https://github.com/dluvian/voyage/releases" target="_blank">Voyage</a> (android).)</small></p>

        <CButton color={progressColor}  className="my-3" active tabIndex={-1} 
          onClick={() => doExport()} disabled={loading}>
            {!loading ? 'Get my Grapevine Reccomended' : loaded ? 'Complete!' : progressMessage }
        </CButton>
        {userProfileDisplay}
        <CProgressStacked>
          {progressLogin}
          {progressFirstHop}
          {progressSecondHop}
          {progressCalculating}
        </CProgressStacked>
        {refreshNotice}
      </center>
      {grapevineListOutput ? grapevineListOutput : (<center>{influenceScore}</center>)}

    </>
  )
}


export default ExportGrapevineList



