import React, { useCallback, useState } from 'react'
import { CCol, CFormSwitch, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilBoltCircle, cilCircle, cilGraph, cilThumbUp } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { toggleIndividualListener } from '../../../redux/features/settings/slice'

const GeneralSettings = () => {
  const dispatch = useDispatch()

  const generalSettings = useSelector((state) => state.settings.general)

  let currentListenerMode1 = 'hide'
  let currentListenerMode2 = 'hide'
  let currentListenerMode3 = 'hide'
  let currentListenerMode4 = 'hide'
  let currentListenerMode5 = 'hide'

  if (generalSettings && generalSettings.listeners && generalSettings.listeners) {
    currentListenerMode1 = generalSettings.listeners.listener1
    currentListenerMode2 = generalSettings.listeners.listener2
    currentListenerMode3 = generalSettings.listeners.listener3
    currentListenerMode4 = generalSettings.listeners.listener4
    currentListenerMode5 = generalSettings.listeners.listener5
  }
  const [listenerMode1, setListenerMode1] = useState(currentListenerMode1)
  const [listenerMode2, setListenerMode2] = useState(currentListenerMode2)
  const [listenerMode3, setListenerMode3] = useState(currentListenerMode3)
  const [listenerMode4, setListenerMode4] = useState(currentListenerMode4)
  const [listenerMode5, setListenerMode5] = useState(currentListenerMode5)

  const [isListenerMode1, setIsListenerMode1] = useState(currentListenerMode1 == 'show')
  const [isListenerMode2, setIsListenerMode2] = useState(currentListenerMode2 == 'show')
  const [isListenerMode3, setIsListenerMode3] = useState(currentListenerMode3 == 'show')
  const [isListenerMode4, setIsListenerMode4] = useState(currentListenerMode4 == 'show')
  const [isListenerMode5, setIsListenerMode5] = useState(currentListenerMode5 == 'show')

  // wildly inelegant code, but works
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
        // console.log('dispatch toggleIndividualListener hide')
        dispatch(toggleIndividualListener({ newState: 'hide', num }))
      }
    },
    [listenerMode1, listenerMode2, listenerMode3, listenerMode4, listenerMode5],
  )
  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
      <div>
        <strong>For more informative DoS, WoT, and Influence Scores *</strong>, (to extend your web
        of trust past 2 hops), turn listeners <strong>on</strong>.
      </div>
      <div>
        <strong>For improved site performance</strong>, turn profile listeners <strong>off</strong>.
      </div>
      <br />
      <div>download/store kind 0, kind 3, and kind 10000 events in the background for:</div>
      <br />
      <CFormSwitch
        checked={isListenerMode1}
        onChange={(e) => toggleListener('1')}
        label="me (toggle not active)"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode2}
        onChange={(e) => toggleListener('2')}
        label="me and my follows (toggle working)"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode3}
        onChange={(e) => toggleListener('3')}
        label="the profile being viewed (toggle not active)"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode4}
        onChange={(e) => toggleListener('4')}
        label="all profiles (toggle working)"
      />
      <br />
      <CFormSwitch
        checked={isListenerMode5}
        onChange={(e) => toggleListener('5')}
        label="authors (listener not yet implemented)"
      />
      <br />
      <div>
        * To calculate scores, profile follows and mutes are downloaded and stored locally. Data is
        cleared upon logout.
      </div>
    </>
  )
}

export default GeneralSettings

/*

      */
