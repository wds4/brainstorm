import React, { useCallback, useState } from 'react'
import { CButton, CFormSwitch } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleIndividualListener } from 'src/redux/features/settings/slice'
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

const GeneralSettings = () => {
  console.log('GeneralSettings')

  const dispatch = useDispatch()

  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oMyProfile = oProfilesByNpub[myNpub]
  let aMyFollows = []
  let aTwoHops = []
  let aMoreHops = []
  if (oMyProfile) {
    aMyFollows = oMyProfile.follows
  }

  const aProfilesWithKnownFollows = []
  Object.keys(oProfilesByNpub).forEach((np) => {
    if (oProfilesByNpub[np].follows && oProfilesByNpub[np].follows.length > 0) {
      aProfilesWithKnownFollows.push(np)
    }
    if (
      oProfilesByNpub[np] &&
      oProfilesByNpub[np].wotScores &&
      oProfilesByNpub[np].wotScores.degreesOfSeparationFromMe
    ) {
      const dos = oProfilesByNpub[np].wotScores.degreesOfSeparationFromMe
      if (dos == 2) {
        if (!aTwoHops.includes(np)) {
          aTwoHops.push(np)
        }
      }
      if (dos > 2) {
        if (!aMoreHops.includes(np)) {
          aMoreHops.push(np)
        }
      }
    }
  })

  let numFollowsText = aProfilesWithKnownFollows.length + ' profiles'
  if (aProfilesWithKnownFollows.length == 1) {
    numFollowsText = aProfilesWithKnownFollows.length + ' profile'
  }
  let promptClassName = 'hide'
  if (aProfilesWithKnownFollows.length < 10) {
    promptClassName = 'show'
  }
  const [promptNeedMoreFollowsDataClassName, setPromptNeedMoreFollowsDataClassName] =
    useState(promptClassName)

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
      // console.log('toggleListener: ' + num)
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
          setListenerMode1('show')
        }
        if (num == 2) {
          setIsListenerMode2(true)
          setListenerMode2('show')
        }
        if (num == 3) {
          setIsListenerMode3(true)
          setListenerMode3('show')
        }
        if (num == 4) {
          setIsListenerMode4(true)
          setListenerMode4('show')
        }
        if (num == 5) {
          setIsListenerMode5(true)
          setListenerMode5('show')
        }
        if (num == 6) {
          setIsListenerMode6(true)
          setListenerMode6('show')
        }
        if (num == 7) {
          setIsListenerMode7(true)
          setListenerMode7('show')
        }
        // console.log('dispatch toggleIndividualListener show')
        dispatch(toggleIndividualListener({ newState: 'show', num }))
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
        // console.log('dispatch toggleIndividualListener hide')
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

  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        <strong>one hop</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aMyFollows.length} profiles one hop away
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode1}
          onChange={(e) => toggleListener('1')}
          label="Download my follows in background."
        />
        <div>
          This probably will not impact website performance, but you can turn it off if necessary.
        </div>
      </div>
      <br />
      <br />
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        <strong>two hops</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aTwoHops.length} profiles two hops away
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode2}
          onChange={(e) => toggleListener('2')}
          label="Download follows of my follows in background. This may impact website performance."
        />
      </div>
      <br />
      <br />
      <div style={{ borderBottom: '1px solid grey', marginBottom: '5px' }}>
        <strong>more hops</strong>
        <div style={{ display: 'inline-block', float: 'right' }}>
          {aMoreHops.length} profiles over two hops away
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <CFormSwitch
          checked={isListenerMode5}
          onChange={(e) => toggleListener('5')}
          label="Download follows of Nostrapedia authors in the background."
        />
        <CFormSwitch
          checked={isListenerMode4}
          onChange={(e) => toggleListener('4')}
          label="Download follows of all profiles in background. This will probably impact website performance."
        />
      </div>
      <br />
      <br />
      <div>
        For performance, we recommend you turn off all of the above downloads before navigating back to Nostrapedia.
      </div>
      <br />
      <div>Moving or deprecating what's below.</div>


      <div>Follows data has been downloaded for {numFollowsText}.</div>
      <div className={promptNeedMoreFollowsDataClassName}>
        <div
          style={{
            border: '2px solid purple',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'inline-block', textAlign: 'left' }}>
            You have follows data on only {numFollowsText}. Trust scores will be more informative
            after loading more follows data.
          </div>
          <br />
          <div style={{ display: 'inline-block', textAlign: 'left' }}>
            <li>Below, turn on the "my follows" listener.</li>
            <li>
              Allow time for follows and mutes data to download, perhaps a minute or a few minutes.
            </li>
            <li>Wait for more follows data to be downloaded, as indicated above.</li>
            <li>For better website performance, turn extra listeners back off.</li>
            <li>
              <div style={{ display: 'inline-block' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Calculate WoT, DoS and Influence scores using the{' '}
                  <CButton href="#/grapevine" color="primary" style={{ marginLeft: '5px' }}>
                    Grapevine
                  </CButton>
                  .
                </div>
              </div>
            </li>
            <li>Go back to Nostrapedia and use scores to sort content!</li>
            <li>You can come back to download more follows data.</li>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <div>Download/store kind 0, kind 3, and kind 10000 events in the background for:</div>
      <br />
      <CFormSwitch
        checked={isListenerMode1}
        onChange={(e) => toggleListener('1')}
        label="my profile"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode2}
        onChange={(e) => toggleListener('2')}
        label="profiles of me and my follows"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode3}
        onChange={(e) => toggleListener('3')}
        label="the profile being viewed"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode4}
        onChange={(e) => toggleListener('4')}
        label="all profiles"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode5}
        onChange={(e) => toggleListener('5')}
        label="nostrapedia authors"
      />
      <br />
      <div>download content in app-specific pages:</div>
      <br />
      <CFormSwitch
        checked={isListenerMode6}
        onChange={(e) => toggleListener('6')}
        label="nostrapedia content (kind 30818)"
        disabled
      />
      <br />
      <CFormSwitch
        checked={isListenerMode6}
        onChange={(e) => toggleListener('7')}
        label="concept graph content (kinds 9902, 39902)"
        disabled
      />
      <br />
    </>
  )
}

export default GeneralSettings
