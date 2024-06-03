import { CFormInput, CFormSelect } from '@coreui/react'
import React, { useCallback } from 'react'
import { updateSortWikiAuthorsBy } from '../../../redux/features/siteNavigation/slice'
import { useDispatch } from 'react-redux'

const SortAndFilter = ({ searchField, setSearchField, sortBy, setSortBy, sortAndFilterItems }) => {

  const updateSortBySelector = useCallback(
    (newSortByValue) => {
      setSortBy(newSortByValue)
      // dispatch(updateSortWikiAuthorsBy(newSortByValue))
      sortAndFilterItems(searchField, newSortByValue)
    },
    [searchField, sortBy],
  )

  const handleSearchFieldChange = useCallback(
    (e) => {
      const newField = e.target.value
      setSearchField(newField)
      sortAndFilterItems(newField, sortBy)
    },
    [searchField, sortBy],
  )

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-block' }}>
          <CFormSelect
            value={sortBy}
            onChange={(e) => {
              updateSortBySelector(e.target.value)
            }}
            id="sortBySelector"
            options={[
              { label: 'alphabetical', value: 'alphabetical' },
              { label: 'reverse alphabetical', value: 'reverseAlphabetical' },
              { label: '# of topics', value: 'numerical' },
              { label: 'most recent', value: 'chronological' },
              { label: 'degrees of separation', value: 'degreesOfSeparation' },
              { label: 'WoT score', value: 'wotScore' },
              { label: 'Influence Score', value: 'influenceScore' },
            ]}
          ></CFormSelect>
        </div>
      </div>
      <CFormInput
        label="search by author (name, display_name, or npub):"
        type="text"
        value={searchField}
        onChange={handleSearchFieldChange}
      />
      <br />
    </>
  )
}

export default SortAndFilter
