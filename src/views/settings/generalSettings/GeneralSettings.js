import React, { useCallback, useState } from 'react'
import { CCol, CFormSelect, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateListenerMethod } from '../../../redux/features/settings/slice'

const GeneralSettings = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  const [listenerMethodState, setListenerMethodState] = useState(listenerMethod)
  const dispatch = useDispatch()

  const changeListenerMethod = useCallback((newListenerMethod) => {
    console.log('new listener method: ' + newListenerMethod)
    setListenerMethodState(newListenerMethod)
    dispatch(updateListenerMethod(newListenerMethod))
  }, [])
  return (
    <>
      <center>
        <h4>General Settings</h4>
      </center>
      <br />
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
    </>
  )
}

export default GeneralSettings
