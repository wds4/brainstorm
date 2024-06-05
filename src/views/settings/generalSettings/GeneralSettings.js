import React, { useCallback, useState } from 'react'
import { CFormSwitch } from '@coreui/react'
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

const GeneralSettings = () => {
  console.log('GeneralSettings')
  const dispatch = useDispatch()

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

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aProfilesWithKnownFollows = []
  Object.keys(oProfilesByNpub).forEach((np) => {
    if (oProfilesByNpub[np].follows && oProfilesByNpub[np].follows.length > 0) {
      aProfilesWithKnownFollows.push(np)
    }
  })

  let numFollowsText = aProfilesWithKnownFollows.length + ' profiles'
  if (aProfilesWithKnownFollows.length == 1) {
    numFollowsText = aProfilesWithKnownFollows.length + ' profile'
  }
  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
      <div>
        <strong>For more informative DoS, WoT, and Influence Scores</strong>, you need follows data.
      </div>
      <div>Follows data has been downloaded for {numFollowsText}.</div>
      <div>
        For more follows data, turn listeners <strong>ON</strong>. Recalculate WoT, DoS and Influence Scores after downloading new follows data.
      </div>
      <div>
        <strong>For improved site performance</strong>, turn profile listeners <strong>OFF</strong>.
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

/*

      */
