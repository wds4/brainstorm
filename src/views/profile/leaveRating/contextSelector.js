import React, { useState } from 'react'
import { CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const ContextSelector = ({ updateSelectedContext }) => {
  const [selectedDescription, setSelectedDescription] = useState('')
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oWikiCategories = useSelector((state) => state.nostrapedia.categories)
  const updateCategory = (e) => {
    setSelectedDescription(e.target.selectedOptions[0].dataset.description)
    updateSelectedContext(e.target.value)
  }
  return (
    <>
      <CFormSelect
        onChange={(e) => {
          updateCategory(e)
        }}
      >
        <option value="unselected" selected disabled data-description="">
          select a category
        </option>
        {Object.keys(oWikiCategories).map((categoryName, item) => {
          return (
            <option key={item} value={categoryName} description={categoryName}>
              {categoryName}
            </option>
          )
        })}
      </CFormSelect>
    </>
  )
}

export default ContextSelector
