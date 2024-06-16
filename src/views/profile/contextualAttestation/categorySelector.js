import React, { useState } from 'react'
import { CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from 'src/helpers'

// eslint-disable-next-line react/prop-types
const ContextSelector = ({ updateSelectedContext }) => {
  const [selectedDescription, setSelectedDescription] = useState('')
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oWikiCategories = useSelector((state) => state.wikifreedia.categories)
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
          select category
        </option>
        {Object.keys(oWikiCategories).map((categoryName, item) => {
          return (
            <option key={item} value={categoryName} data-description={categoryName}>
              {categoryName}
            </option>
          )
        })}
      </CFormSelect>
    </>
  )
}

export default ContextSelector
