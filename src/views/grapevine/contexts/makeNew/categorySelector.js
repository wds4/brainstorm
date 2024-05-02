import React, { useState } from 'react'
import { CCardBody, CFormSelect } from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'

const CategorySelector = ({ updateSelectedCategory }) => {
  const [selectedDescription, setSelectedDescription] = useState('')
  const oCategories = useSelector((state) => state.grapevine.categories)
  const updateCategory = (e) => {
    setSelectedDescription(e.target.selectedOptions[0].dataset.description)
    updateSelectedCategory(e.target.value)
  }
  return (
    <>
      <CFormSelect
        className="mb-3"
        label="select category"
        onChange={(e) => {
          updateCategory(e)
        }}
      >
        <option value="" data-description="">
          in all categories
        </option>
        {Object.keys(oCategories).map((key) => {
          const event = oCategories[key]
          const name = fetchFirstByTag('name', event)
          const description = fetchFirstByTag('description', event)
          return (
            <option key={key} value={key} data-description={description}>
              {name} - {key}
            </option>
          )
        })}
      </CFormSelect>
      <CCardBody>{selectedDescription}</CCardBody>
    </>
  )
}

export default CategorySelector
