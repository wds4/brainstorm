import React, { useCallback, useState } from 'react'
import { CCol, CFormSwitch, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilBoltCircle, cilCircle, cilGraph, cilThumbUp } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'

const GeneralSettings = () => {
  const dispatch = useDispatch

  const generalSettings = useSelector((state) => state.settings.general)
  let currentListenerMode1 = 'hide'
  if (generalSettings && generalSettings.listeners && generalSettings.listeners.listener1) {
    currentListenerMode1 = generalSettings.listeners.listener1
  }
  const [isListenerActive1, setIsListenerActive1] = useState(currentListenerMode1 == 'show')

  const toggleListener = React.useCallback((e) => {
    console.log('toggleListener')
  }, [])
  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
      <div>
        <strong>For more informative DoS, WoT, and Influence Scores *</strong>, (to extend your web of trust past 2 hops),
        turn listeners <strong>on</strong>.
      </div>
      <div>
        <strong>For improved site performance</strong>, turn profile listeners <strong>off</strong>.
      </div>
      <br />
      <div>toggle switches not yet functional</div>
      <div>download/store kind 0, kind 3, and kind 10000 events for:</div>
      <br />
      <CFormSwitch checked={isListenerActive1} onChange={(e) => toggleListener(e)} label="me" id="formSwitchCheckDefault" />
      <br />
      <CFormSwitch checked={isListenerActive1} onChange={(e) => toggleListener(e)} label="my follows" id="formSwitchCheckDefault" />
      <br />
      <CFormSwitch checked={isListenerActive1} onChange={(e) => toggleListener(e)} label="the profile being viewed" id="formSwitchCheckDefault" />
      <br />
      <CFormSwitch checked={isListenerActive1} onChange={(e) => toggleListener(e)} label="all profiles" id="formSwitchCheckDefault" />
      <br />
      <CFormSwitch checked={isListenerActive1} onChange={(e) => toggleListener(e)} label="authors" id="formSwitchCheckDefault" />
      <br />
      <div>
        * To calculate scores, profile follows and mutes are downloaded and stored locally. Data is cleared upon logout.
      </div>
    </>
  )
}

export default GeneralSettings
