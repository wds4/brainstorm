import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { updateViewWikifreediaCategory } from '../../../redux/features/siteNavigation/slice'

const WikifreediaCategories = () => {
  const oWikiCategories = useSelector((state) => state.wikifreedia.categories)
  const aWikiCategories = Object.keys(oWikiCategories)

  const dispatch = useDispatch()

  const processCategoryClick = (category) => {
    // console.log('processCategoryClick category: ' + category)
    dispatch(updateViewWikifreediaCategory(category))
  }
  return (
    <>
      <center>
        <h3>Wiki Categories</h3>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{aWikiCategories.length} categories</strong>
            </CCardHeader>
            <CCardBody>
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">category</CTableHeaderCell>
                    <CTableHeaderCell scope="col"># of topics</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aWikiCategories.map((category, item) => {
                    const oTopics = oWikiCategories[category]
                    const aTopics = Object.keys(oTopics)
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <CNavLink
                            href="#/wikifreedia/singleCategory"
                            onClick={() => processCategoryClick(category)}
                          >
                            {category}
                          </CNavLink>
                        </CTableDataCell>
                        <CTableDataCell>{aTopics.length}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WikifreediaCategories
