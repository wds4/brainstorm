import React, { useState } from 'react'
import { CFormInput, CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const ContextSelector = ({ updateSelectedContext }) => {
  // const [selectedDescription, setSelectedDescription] = useState('')
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oWikiCategories = useSelector((state) => state.nostrapedia.categories)

  const [categorySelectorValue, setCategorySelectorValue] = useState('unselected')
  const updateCategoryViaSelector = (e) => {
    // setSelectedDescription(e.target.selectedOptions[0].dataset.description)
    updateSelectedContext(e.target.value)
    setCustomInputValue('')
    setCategorySelectorValue(e.target.value)
  }

  const [customInputValue, setCustomInputValue] = useState('')
  const updateCategoryViaInput = (e) => {
    // setSelectedDescription(e.target.selectedOptions[0].dataset.description)
    updateSelectedContext(e.target.value)
    setCustomInputValue(e.target.value)
    setCategorySelectorValue('unselected')
  }
  return (
    <>
      <CFormSelect
        onChange={(e) => {
          updateCategoryViaSelector(e)
        }}
        id="categorySelector"
        value={categorySelectorValue}
      >
        <option value="unselected" selected disabled data-description="">
          select a category from existing Wiki categories ...
        </option>
        {Object.keys(oWikiCategories).sort().map((categoryName, item) => {
          return (
            <option key={item} value={categoryName} description={categoryName}>
              {categoryName}
            </option>
          )
        })}
      </CFormSelect>
      <CFormInput
        onChange={(e) => {
          updateCategoryViaInput(e)
        }}
        id="customInputField"
        value={customInputValue}
        placeholder="... or create your own category"
      />
    </>
  )
}

export default ContextSelector
