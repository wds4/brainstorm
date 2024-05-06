import React, { useCallback, useState } from 'react'
import { CAvatar, CCol, CContainer, CNav, CNavLink, CRow } from '@coreui/react'
import GrapevineSettings from '../grapevineSettings/Settings'
import ConceptGraphSettings from '../conceptGraphSettings/Settings'
import TwittrSettings from '../twittrSettings/Settings'

// eslint-disable-next-line react/prop-types
const SettingsContent = ({ whichSettings }) => {
  const currentTime = Math.floor(Date.now() / 1000)
  if (whichSettings == 'general') {
    return (
      <>
        general settings
        <div>currentTime: {currentTime}</div>
        <br />
      </>
    )
  }
  if (whichSettings == 'grapevine') {
    return <GrapevineSettings />
  }
  if (whichSettings == 'conceptGraph') {
    return <ConceptGraphSettings />
  }
  if (whichSettings == 'twittr') {
    return <TwittrSettings />
  }
  return <>general settings</>
}
// eslint-disable-next-line react/prop-types
const SettingsNavigation = ({ updateWhichSettings }) => {
  const [isGeneral, setIsGeneral] = useState(true)
  const [isGrapevine, setIsGrapevine] = useState(false)
  const [isConceptGraph, setIsConceptGraph] = useState(false)
  const [isTwittr, setIsTwittr] = useState(false)

  const setAllOptionsToFalse = () => {
    setIsGeneral(false)
    setIsGrapevine(false)
    setIsConceptGraph(false)
    setIsTwittr(false)
  }

  const setActiveTabGeneral = () => {
    setAllOptionsToFalse()
    setIsGeneral(true)
    updateWhichSettings('general')
  }
  const setActiveTabGrapevine = () => {
    setAllOptionsToFalse()
    setIsGrapevine(true)
    updateWhichSettings('grapevine')
  }
  const setActiveTabConceptGraph = () => {
    setAllOptionsToFalse()
    setIsConceptGraph(true)
    updateWhichSettings('conceptGraph')
  }
  const setActiveTabTwittr = () => {
    setAllOptionsToFalse()
    setIsTwittr(true)
    updateWhichSettings('twittr')
  }

  return (
    <CNav as="nav" variant="tabs" layout="fill" className="flex-column flex-sm-row">
      <CNavLink active={isGeneral} onClick={setActiveTabGeneral}>
        General
      </CNavLink>
      <CNavLink active={isGrapevine} onClick={setActiveTabGrapevine}>
        Grapevine
      </CNavLink>
      <CNavLink active={isConceptGraph} onClick={setActiveTabConceptGraph}>
        Concept Graph
      </CNavLink>
      <CNavLink active={isTwittr} onClick={setActiveTabTwittr}>
        Twittr
      </CNavLink>
    </CNav>
  )
}

const GeneralSettings = () => {
  const [whichSettings, setWhichSettings] = useState('general') // use names of apps: general, grapevine, conceptGraph, twittr
  return (
    <>
      <CContainer fluid>
        <center>
          <h3>Settings</h3>
        </center>
        <SettingsNavigation updateWhichSettings={setWhichSettings} />
        <br />
        <SettingsContent whichSettings={whichSettings} />
      </CContainer>
    </>
  )
}

export default GeneralSettings
