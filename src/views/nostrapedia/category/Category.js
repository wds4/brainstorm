import React, { useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { updateViewNostrapediaTopic } from '../../../redux/features/siteNavigation/slice'

const WikiCategory = () => {
  // const [aTopics, setATopics] = useState([])
  const oEvents = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiCategories = useSelector((state) => state.wikifreedia.categories)
  const categoryName = useSelector((state) => state.siteNavigation.wikifreedia.viewCategory)
  const oTopics = oWikiCategories[categoryName]
  let aTopics = []
  if (oTopics) {
    aTopics = Object.keys(oTopics)
  }

  const dispatch = useDispatch()

  const processTopicClick = (topic) => {
    dispatch(updateViewNostrapediaTopic(topic))
  }
  return (
    <>
      <center>
        <h3>Category: {categoryName}</h3>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{aTopics.length} topics under this category</strong>
            </CCardHeader>
            <CCardBody>
              <CTable small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">topic</CTableHeaderCell>
                    <CTableHeaderCell scope="col"># versions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aTopics.map((topic, item) => {
                    const aNaddr = oTopics[topic]
                    return (
                      <CTableRow key={item}>
                        <CTableHeaderCell scope="row">
                          <CNavLink
                            href="#/nostrapedia/topic"
                            onClick={() => processTopicClick(topic)}
                          >
                            {topic}
                          </CNavLink>
                        </CTableHeaderCell>
                        <CTableDataCell>{aNaddr.length}</CTableDataCell>
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

export default WikiCategory
