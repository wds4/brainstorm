import React from 'react'
import { CNavLink } from '@coreui/react'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { updateApp } from '../../redux/features/siteNavigation/slice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const updateActiveApp = (newApp) => {
    dispatch(updateApp(newApp))
  }
  return (
    <>
      <center>
        <h3>Pretty Good Apps</h3>
        <div>This site is under construction!</div>
      </center>
      <CCol lg={4} key="0">
        <CNavLink href="#/grapevine" onClick={() => updateActiveApp('grapevine')}>
          <CCard className="mb-3 border-dark">
            <CCardHeader>
              <strong>The Grapevine</strong>
            </CCardHeader>
            <CCardBody>
              <CCardText>
                The Grapevine enables you and your community to identify who is the most
                trustworthy, and in what context, to curate content, facts, and information.
              </CCardText>
            </CCardBody>
          </CCard>
        </CNavLink>
      </CCol>
    </>
  )
}

export default Dashboard
