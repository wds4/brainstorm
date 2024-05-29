import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { updateViewNostrapediaCategory } from '../../../redux/features/siteNavigation/slice'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

const NostrapediaCategories = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const oWikiCategories = useSelector((state) => state.wikifreedia.categories)
  const aWikiCategories = Object.keys(oWikiCategories)

  const dispatch = useDispatch()

  const processCategoryClick = (category) => {
    // console.log('processCategoryClick category: ' + category)
    dispatch(updateViewNostrapediaCategory(category))
  }

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }
  return (
    <>
      <CContainer fluid>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ float: 'right' }} className={loggedInClassName}>
            <CButton color="success" href="#/nostrapedia/publish">
              <CIcon icon={cilPencil} /> Write an article
            </CButton>
          </div>
          <center>
            <h3>Categories</h3>
          </center>
        </div>
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
                              href="#/nostrapedia/singleCategory"
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
      </CContainer>
    </>
  )
}

export default NostrapediaCategories
