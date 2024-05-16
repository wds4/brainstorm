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
            <option value="oneMainListener">standard method</option>
            <option value="individualListeners">experimental method</option>
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
