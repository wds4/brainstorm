import React, { useState } from 'react'
import { CCardBody, CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from 'src/helpers'

// eslint-disable-next-line react/prop-types
const ContextSelector = ({ updateSelectedContext }) => {
  const [selectedDescription, setSelectedDescription] = useState('')
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const updateContext = (e) => {
    setSelectedDescription(e.target.selectedOptions[0].dataset.description)
    updateSelectedContext(e.target.value)
  }
  return (
    <>
      <CFormSelect
        onChange={(e) => {
          updateContext(e)
        }}
      >
        <option value="unselected" selected disabled data-description="">
          select context
        </option>
        <option value="*" data-description="">
          in all contexts
        </option>
        {Object.keys(oContexts).map((key) => {
          const event = oContexts[key]
          const name = fetchFirstByTag('name', event)
          const description = fetchFirstByTag('description', event)
          return (
            <option key={key} value={key} data-description={description}>
              {name}
            </option>
          )
        })}
      </CFormSelect>
    </>
  )
}

export default ContextSelector
