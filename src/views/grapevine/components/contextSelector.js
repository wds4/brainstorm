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
        className="mb-3"
        label="select context"
        onChange={(e) => {
          updateContext(e)
        }}
      >
        <option value="" data-description="">
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
      <CCardBody>{selectedDescription}</CCardBody>
    </>
  )
}

export default ContextSelector
