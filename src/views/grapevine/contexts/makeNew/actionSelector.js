import React, { useState } from 'react'
import { CCardBody, CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'

const ActionSelector = ({ updateSelectedAction }) => {
  const [selectedDescription, setSelectedDescription] = useState('')
  const oActions = useSelector((state) => state.grapevine.actions)
  const updateAction = (e) => {
    setSelectedDescription(e.target.selectedOptions[0].dataset.description)
    updateSelectedAction(e.target.value)
  }
  return (
    <>
      <CFormSelect
        className="mb-3"
        label="select action"
        onChange={(e) => {
          updateAction(e)
        }}
      >
        <option value="" data-description="">
          in all actions
        </option>
        {Object.keys(oActions).map((key) => {
          const event = oActions[key]
          const name = fetchFirstByTag('name', event)
          const description = fetchFirstByTag('description', event)
          return (
            <option key={key} value={key} data-description={description}>
              {name}
            </option>
          )
        })}
      </CFormSelect>
      <CCardBody>{selectedDescription}</CCardBody>
    </>
  )
}

export default ActionSelector
