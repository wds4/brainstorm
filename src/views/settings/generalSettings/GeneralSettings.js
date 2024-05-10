import React, { useCallback, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormSwitch } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateActiveRelays, updateActiveRelaysGroups } from 'src/redux/features/settings/slice'
import { aDefaultRelays } from 'src/const'
import { removeDuplicatesFromArrayOfStrings } from 'src/helpers'

const GeneralSettings = () => {
  const aActiveRelays = useSelector((state) => state.settings.general.aActiveRelays)
  const aActiveRelaysGroups = useSelector((state) => state.settings.general.aActiveRelaysGroups)
  const personalRelay = useSelector((state) => state.settings.conceptGraph.personalRelay)
  const myCurrentProfileKind3Relays = useSelector((state) => state.profile.kind3.relays)

  const dispatch = useDispatch()

  const [isDefault, setIsDefault] = useState(aActiveRelaysGroups.includes('default'))
  const [isProfile, setIsProfile] = useState(aActiveRelaysGroups.includes('profile'))
  const [isPersonalRelay, setIsPersonalRelay] = useState(
    aActiveRelaysGroups.includes('personalRelay'),
  )

  const currentTime = Math.floor(Date.now() / 1000)

  const changeActiveRelaysGroups = useCallback(
    (groupName) => {
      const aNewActiveRelaysGroups = []
      let aNewActiveRelays = []
      let includeDefault = isDefault
      let includeProfile = isProfile
      let includePersonalRelay = isPersonalRelay
      if (groupName == 'default') {
        includeDefault = !isDefault
      }
      if (groupName == 'profile') {
        includeProfile = !isProfile
      }
      if (groupName == 'personalRelay') {
        includePersonalRelay = !isPersonalRelay
      }

      if (includeDefault) {
        aNewActiveRelaysGroups.push('default')
        aNewActiveRelays = aNewActiveRelays.concat(aDefaultRelays)
      }
      if (includeProfile) {
        aNewActiveRelaysGroups.push('profile')
        aNewActiveRelays = aNewActiveRelays.concat(Object.keys(myCurrentProfileKind3Relays))
      }
      if (includePersonalRelay) {
        aNewActiveRelaysGroups.push('personalRelay')
        if (personalRelay) {
          aNewActiveRelays = aNewActiveRelays.concat(personalRelay)
        }
      }
      dispatch(updateActiveRelaysGroups(aNewActiveRelaysGroups))
      aNewActiveRelays = removeDuplicatesFromArrayOfStrings(aNewActiveRelays)
      dispatch(updateActiveRelays(aNewActiveRelays))
    },
    [isDefault, isProfile, isPersonalRelay],
  )

  const processChange = useCallback(
    (groupName) => {
      if (groupName == 'default') {
        setIsDefault(!isDefault)
      }
      if (groupName == 'profile') {
        setIsProfile(!isProfile)
      }
      if (groupName == 'personalRelay') {
        setIsPersonalRelay(!isPersonalRelay)
      }
      changeActiveRelaysGroups(groupName)
    },
    [isDefault, isProfile, isPersonalRelay],
  )

  return (
    <>
      <center>
        <h4>General Settings</h4>
        <div>currentTime: {currentTime}</div>
        <div>window.location.origin: {window.location.origin}</div>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Relay Groups</strong> <small>Select which relay groups to be active.</small>
            </CCardHeader>
            <CCardBody>
              <div>NOT YET FULLY FUNCTIONAL</div>
              <CFormSwitch
                label="brainstorm app default relays"
                checked={isDefault}
                onChange={() => {
                  processChange('default')
                }}
              />
              <CFormSwitch
                label="your nostr profile relays"
                checked={isProfile}
                onChange={() => {
                  processChange('profile')
                }}
              />
              <CFormSwitch
                label="your concept graph personal relay (see Concept Graph settings for details)"
                checked={isPersonalRelay}
                onChange={() => {
                  processChange('personalRelay')
                }}
              />
              <div>aActiveRelaysGroups: {JSON.stringify(aActiveRelaysGroups, null, 4)}</div>
              <div>aActiveRelays: {JSON.stringify(aActiveRelays, null, 4)}</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default GeneralSettings
