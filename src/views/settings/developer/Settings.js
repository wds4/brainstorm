import React, { useCallback, useState } from 'react'
import { CCol, CRow, CFormSwitch, CFormSelect } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDevelopmentMode, updateListenerMethod } from '../../../redux/features/settings/slice'

const DeveloperSettings = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  const [listenerMethodState, setListenerMethodState] = useState(listenerMethod)
  const dispatch = useDispatch()

  const changeListenerMethod = useCallback((newListenerMethod) => {
    setListenerMethodState(newListenerMethod)
    dispatch(updateListenerMethod(newListenerMethod))
  }, [])

  const currentDevelopmentMode = useSelector((state) => state.settings.general.developmentMode)
  const signedIn = useSelector((state) => state.profile.signedIn)
  const [developmentMode, setDevelopmentMode] = useState(currentDevelopmentMode)
  const [isDevMode, setIsDevMode] = useState(currentDevelopmentMode == 'show')

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
      } else {
        if (developmentMode == 'show') {
          setIsDevMode(false)
          setDevelopmentMode('hide')
          dispatch(updateDevelopmentMode('hide'))
        } else {
          dispatch(updateDevelopmentMode('hide'))
        }
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
      <br />
      <div className={developmentMode}>
        <CRow>
          <CCol xs={12}>
            <CFormSelect
              value={listenerMethodState}
              onChange={(e) => {
                changeListenerMethod(e.target.value)
              }}
              label="select a nost listener method:"
            >
              <option value="off">off</option>
              <option value="vsListeners">version 3 method (option 1)</option>
              <option value="individualListeners">prior standard method (option 2)</option>
              <option value="oneMainListener">buggy method (option 3)</option>
            </CFormSelect>
            <br />
            <div>
              Set this to off if the website is having performance issues. Especially if your laptop
              is overheating.
            </div>
          </CCol>
        </CRow>
      </div>
    </>
  )
}

export default DeveloperSettings
