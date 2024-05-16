import React, { useCallback, useState } from 'react'
import { CCol, CRow, CFormSwitch } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDevelopmentMode } from '../../../redux/features/settings/slice'

const DeveloperSettings = () => {
  const currentDevelopmentMode = useSelector((state) => state.settings.general.developmentMode)
  const signedIn = useSelector((state) => state.profile.signedIn)
  const [developmentMode, setDevelopmentMode] = useState(currentDevelopmentMode)
  const [isDevMode, setIsDevMode] = useState(currentDevelopmentMode == 'show')

  const dispatch = useDispatch()

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }

  const toggleDevelopmentMode = useCallback(
    (e) => {
      if (!developmentMode) {
        dispatch(updateDevelopmentMode('hide'))
      }
      if (developmentMode == 'hide') {
        setIsDevMode(true)
        setDevelopmentMode('show')
        dispatch(updateDevelopmentMode('show'))
      }
      if (developmentMode == 'show') {
        setIsDevMode(false)
        setDevelopmentMode('hide')
        dispatch(updateDevelopmentMode('hide'))
      }
    },
    [developmentMode],
  )

  return (
    <>
      <center>
        <h4>Developer Settings</h4>
      </center>
      <br />
      <CRow>
        <CCol xs={12}>
          <div className={loggedInClassName}>
            <CFormSwitch
              checked={isDevMode}
              onChange={(e) => toggleDevelopmentMode(e)}
              label="development mode: reveal stuff that's currently under construction. NOT RECOMMENDED."
            />
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default DeveloperSettings
