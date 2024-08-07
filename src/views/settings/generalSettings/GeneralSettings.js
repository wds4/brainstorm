import React, { useCallback, useState } from 'react'
import { CButton, CFormSwitch } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleIndividualListener } from '../../../redux/features/settings/slice'
import {
  defListener1,
  defListener2,
  defListener3,
  defListener4,
  defListener5,
  defListener6,
  defListener7,
  defListener8,
  defListener9,
  defListener10,
} from 'src/const'
import { nip19 } from 'nostr-tools'
import { updateApp } from '../../../redux/features/siteNavigation/slice'

const GeneralSettings = () => {
  const dispatch = useDispatch()

  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oMyProfile = oProfilesByNpub[myNpub]
  let aOneHop = []
  let aTwoHops = []
  let aMoreHops = []
  let aDisconnected = []
  if (oMyProfile) {
    aOneHop = oMyProfile.follows
  }

  const aProfilesWithKnownFollows = []
  Object.keys(oProfilesByNpub).forEach((np) => {
    if (oProfilesByNpub[np].follows && oProfilesByNpub[np].follows.length > 0) {
      aProfilesWithKnownFollows.push(np)
    }
    if (
      oProfilesByNpub[np] &&
      oProfilesByNpub[np].wotScores &&
      oProfilesByNpub[np].wotScores.degreesOfSeparation
    ) {
      const dos = oProfilesByNpub[np].wotScores.degreesOfSeparation
      if (dos == 2) {
        if (!aTwoHops.includes(np)) {
          aTwoHops.push(np)
        }
      }
      if (dos > 2 && dos < 100) {
        if (!aMoreHops.includes(np)) {
          aMoreHops.push(np)
        }
      }
      if (dos > 100) {
        if (!aDisconnected.includes(np)) {
          aDisconnected.push(np)
        }
      }
    }
  })

  const generalSettings = useSelector((state) => state.settings.general)

  // wildly inelegant code, but works
  let currentListenerMode1 = defListener1
  let currentListenerMode2 = defListener2
  let currentListenerMode3 = defListener3
  let currentListenerMode4 = defListener4
  let currentListenerMode5 = defListener5
  let currentListenerMode6 = defListener6
  let currentListenerMode7 = defListener7
  let currentListenerMode8 = defListener8
  let currentListenerMode9 = defListener9
  let currentListenerMode10 = defListener10

  if (generalSettings && generalSettings.listeners && generalSettings.listeners) {
    currentListenerMode1 = generalSettings.listeners.listener1
    currentListenerMode2 = generalSettings.listeners.listener2
    currentListenerMode3 = generalSettings.listeners.listener3
    currentListenerMode4 = generalSettings.listeners.listener4
    currentListenerMode5 = generalSettings.listeners.listener5
    currentListenerMode6 = generalSettings.listeners.listener6
    currentListenerMode7 = generalSettings.listeners.listener7
    currentListenerMode8 = generalSettings.listeners.listener8
    currentListenerMode9 = generalSettings.listeners.listener9
    currentListenerMode10 = generalSettings.listeners.listener10
  }
  const [listenerMode1, setListenerMode1] = useState(currentListenerMode1)
  const [listenerMode2, setListenerMode2] = useState(currentListenerMode2)
  const [listenerMode3, setListenerMode3] = useState(currentListenerMode3)
  const [listenerMode4, setListenerMode4] = useState(currentListenerMode4)
  const [listenerMode5, setListenerMode5] = useState(currentListenerMode5)
  const [listenerMode6, setListenerMode6] = useState(currentListenerMode6)
  const [listenerMode7, setListenerMode7] = useState(currentListenerMode7)
  const [listenerMode8, setListenerMode8] = useState(currentListenerMode8)
  const [listenerMode9, setListenerMode9] = useState(currentListenerMode9)
  const [listenerMode10, setListenerMode10] = useState(currentListenerMode10)

  const [isListenerMode1, setIsListenerMode1] = useState(currentListenerMode1 == 'show')
  const [isListenerMode2, setIsListenerMode2] = useState(currentListenerMode2 == 'show')
  const [isListenerMode3, setIsListenerMode3] = useState(currentListenerMode3 == 'show')
  const [isListenerMode4, setIsListenerMode4] = useState(currentListenerMode4 == 'show')
  const [isListenerMode5, setIsListenerMode5] = useState(currentListenerMode5 == 'show')
  const [isListenerMode6, setIsListenerMode6] = useState(currentListenerMode6 == 'show')
  const [isListenerMode7, setIsListenerMode7] = useState(currentListenerMode7 == 'show')
  const [isListenerMode8, setIsListenerMode8] = useState(currentListenerMode8 == 'show')
  const [isListenerMode9, setIsListenerMode9] = useState(currentListenerMode9 == 'show')
  const [isListenerMode10, setIsListenerMode10] = useState(currentListenerMode10 == 'show')

  const toggleListener = useCallback(
    (num) => {
      let listenerMode = 'hide'
      if (num == 1) {
        listenerMode = listenerMode1
      }
      if (num == 2) {
        listenerMode = listenerMode2
      }
      if (num == 3) {
        listenerMode = listenerMode3
      }
      if (num == 4) {
        listenerMode = listenerMode4
      }
      if (num == 5) {
        listenerMode = listenerMode5
      }
      if (num == 6) {
        listenerMode = listenerMode6
      }
      if (num == 7) {
        listenerMode = listenerMode7
      }
      if (!listenerMode) {
        // in case redux store was not properly initialized
        dispatch(toggleIndividualListener({ newState: 'hide', num }))
      }
      if (listenerMode == 'hide') {
        if (num == 1) {
          setIsListenerMode1(true)
          setIsListenerMode2(false)
          setIsListenerMode4(false)
          setIsListenerMode5(false)
          setListenerMode1('show')
          setListenerMode2('hide')
          setListenerMode4('hide')
          setListenerMode5('hide')
          dispatch(toggleIndividualListener({ newState: 'show', num: 1 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 2 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 4 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 5 }))
        }
        if (num == 2) {
          setIsListenerMode1(false)
          setIsListenerMode2(true)
          setIsListenerMode4(false)
          setIsListenerMode5(false)
          setListenerMode1('hide')
          setListenerMode2('show')
          setListenerMode4('hide')
          setListenerMode5('hide')
          dispatch(toggleIndividualListener({ newState: 'hide', num: 1 }))
          dispatch(toggleIndividualListener({ newState: 'show', num: 2 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 4 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 5 }))
        }
        if (num == 3) {
          setIsListenerMode3(true)
          setListenerMode3('show')
          dispatch(toggleIndividualListener({ newState: 'show', num }))
        }
        if (num == 4) {
          setIsListenerMode1(false)
          setIsListenerMode2(false)
          setIsListenerMode4(true)
          setIsListenerMode5(false)
          setListenerMode1('hide')
          setListenerMode2('hide')
          setListenerMode4('show')
          setListenerMode5('hide')
          dispatch(toggleIndividualListener({ newState: 'hide', num: 1 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 2 }))
          dispatch(toggleIndividualListener({ newState: 'show', num: 4 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 5 }))
        }
        if (num == 5) {
          setIsListenerMode1(false)
          setIsListenerMode2(false)
          setIsListenerMode4(false)
          setIsListenerMode5(true)
          setListenerMode1('hide')
          setListenerMode2('hide')
          setListenerMode4('hide')
          setListenerMode5('show')
          dispatch(toggleIndividualListener({ newState: 'hide', num: 1 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 2 }))
          dispatch(toggleIndividualListener({ newState: 'hide', num: 4 }))
          dispatch(toggleIndividualListener({ newState: 'show', num: 5 }))
        }
        if (num == 6) {
          setIsListenerMode6(true)
          setListenerMode6('show')
          dispatch(toggleIndividualListener({ newState: 'show', num }))
        }
        if (num == 7) {
          setIsListenerMode7(true)
          setListenerMode7('show')
          dispatch(toggleIndividualListener({ newState: 'show', num }))
        }
      }
      if (listenerMode == 'show') {
        if (num == 1) {
          setIsListenerMode1(false)
          setListenerMode1('hide')
        }
        if (num == 2) {
          setIsListenerMode2(false)
          setListenerMode2('hide')
        }
        if (num == 3) {
          setIsListenerMode3(false)
          setListenerMode3('hide')
        }
        if (num == 4) {
          setIsListenerMode4(false)
          setListenerMode4('hide')
        }
        if (num == 5) {
          setIsListenerMode5(false)
          setListenerMode5('hide')
        }
        if (num == 6) {
          setIsListenerMode6(false)
          setListenerMode6('hide')
        }
        if (num == 7) {
          setIsListenerMode7(false)
          setListenerMode7('hide')
        }
        dispatch(toggleIndividualListener({ newState: 'hide', num }))
      }
    },
    [
      listenerMode1,
      listenerMode2,
      listenerMode3,
      listenerMode4,
      listenerMode5,
      listenerMode6,
      listenerMode7,
    ],
  )

  let promptNeedTwoHopsDataClassName = 'hide'
  if (aOneHop.length > 0 && aTwoHops.length == 0) {
    promptNeedTwoHopsDataClassName = 'show'
  }

  const oAuthors = useSelector((state) => state.nostrapedia.authors)
  const aAuthors = Object.keys(oAuthors)

  const labelFoF = 'Download follows of my ' + aOneHop.length + ' follows.'
  const labelAuthors =
    'Download follows of each of the ' + aAuthors.length + ' known Nostrapedia authors.'

  const instructionsA = 'Activate the toggle under STEP 1 to download your follows.'

  const instructionsB =
    'Activate the toggle under STEP 2 to download the follows of your follows. (Refresh this page if you continue to see "0 profiles two hops away" after a minute or so.)'

  const instructionsC =
    'Activate the toggle under STEP 3 to download the follows of Nostrapedia authors. (Refresh this page if you continue to see "0 profiles over two hops away" after a minute or so.)'

  let instructionsCurrent = 'For improved performance, turn off each of the below listeners.'

  let promptNeedMoreFollowsDataClassName = 'hide'
  let promptGoToGrapevineClassName = 'show'
  if (aMoreHops.length == 0) {
    instructionsCurrent = instructionsC
    promptGoToGrapevineClassName = 'hide'
    promptNeedMoreFollowsDataClassName = 'show'
  }
  if (aTwoHops.length == 0) {
    instructionsCurrent = instructionsB
    promptGoToGrapevineClassName = 'hide'
    promptNeedMoreFollowsDataClassName = 'show'
  }
  if (aOneHop.length == 0) {
    instructionsCurrent = instructionsA
    promptGoToGrapevineClassName = 'hide'
    promptNeedMoreFollowsDataClassName = 'show'
  }

  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
      <div className={promptGoToGrapevineClassName}>
        <div
          style={{
            border: '2px solid purple',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            Once profiles one hop, two hops, and more than 2 hops away have been downloaded, go to
            the{' '}
            <CButton
              onClick={() => dispatch(updateApp('grapevine'))}
              color="primary"
              href="#/grapevine"
            >
              Grapevine
            </CButton>{' '}
            to calculate trust scores.
          </div>
        </div>
      </div>
      <div className={promptNeedMoreFollowsDataClassName}>
        <div
          style={{
            border: '2px solid purple',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'left' }}>{instructionsCurrent}</div>
        </div>
      </div>
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        STEP 1: <strong>one hop</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aOneHop.length} profiles one hop away
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode1}
          onChange={(e) => toggleListener('1')}
          label="Download my follows."
        />
      </div>
      <br />
      <br />
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        STEP 2: <strong>two hops</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aTwoHops.length} profiles two hops away
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode2}
          onChange={(e) => toggleListener('2')}
          label={labelFoF}
        />
      </div>
      <br />
      <br />
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        STEP 3: <strong>more hops</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aMoreHops.length} profiles over two hops away
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode5}
          onChange={(e) => toggleListener('5')}
          label={labelAuthors}
        />
      </div>
      <br />
      <br />
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        STEP 4 (optional): <strong>disconnected</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aDisconnected.length} disconnected profiles
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode4}
          onChange={(e) => toggleListener('4')}
          label="Download follows of all profiles."
        />
      </div>
      <br />
      <br />
      <div>
        For best performance, turn off each of the above listeners before navigating away from this page.
      </div>
      <br />
    </>
  )
}

export default GeneralSettings
