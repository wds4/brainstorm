import React, { useState } from 'react'
import { CContainer, CNav, CNavLink } from '@coreui/react'
import GrapevineSettings from '../grapevineSettings/Settings'
import ConceptGraphSettings from '../conceptGraphSettings/Settings'
import TwittrSettings from '../twittrSettings/Settings'
import GeneralSettings from '../generalSettings/GeneralSettings'
import WikiSettings from '../wikifreediaSettings/Settings'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const SettingsContent = ({ whichSettings }) => {
  if (whichSettings == 'general') {
    return <GeneralSettings />
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
  if (whichSettings == 'wikifreedia') {
    return <WikiSettings />
  }
  return <GeneralSettings />
}
// eslint-disable-next-line react/prop-types
const SettingsNavigation = ({ updateWhichSettings }) => {
  const developmentMode = useSelector((state) => state.settings.general.developmentMode)
  const [isGeneral, setIsGeneral] = useState(true)
  const [isGrapevine, setIsGrapevine] = useState(false)
  const [isConceptGraph, setIsConceptGraph] = useState(false)
  const [isTwittr, setIsTwittr] = useState(false)
  const [isWiki, setIsWiki] = useState(false)

  const setAllOptionsToFalse = () => {
    setIsGeneral(false)
    setIsGrapevine(false)
    setIsConceptGraph(false)
    setIsTwittr(false)
    setIsWiki(false)
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
  const setActiveTabWiki = () => {
    setAllOptionsToFalse()
    setIsWiki(true)
    updateWhichSettings('wikifreedia')
  }

  return (
    <CNav as="nav" variant="tabs" layout="fill" className="flex-column flex-sm-row">
      <CNavLink active={isGeneral} onClick={setActiveTabGeneral}>
        General
      </CNavLink>
      <CNavLink
        active={isGrapevine}
        onClick={setActiveTabGrapevine}
        disabled={developmentMode == 'hide'}
      >
        Grapevine
      </CNavLink>
      <CNavLink
        active={isConceptGraph}
        onClick={setActiveTabConceptGraph}
        disabled={developmentMode == 'hide'}
      >
        Concept Graph
      </CNavLink>
      <CNavLink active={isTwittr} onClick={setActiveTabTwittr} disabled={developmentMode == 'hide'}>
        Twittr
      </CNavLink>
      <CNavLink active={isWiki} onClick={setActiveTabWiki} disabled={developmentMode == 'hide'}>
        Wiki
      </CNavLink>
    </CNav>
  )
}

const Settings = () => {
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

export default Settings
