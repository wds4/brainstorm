import React from 'react'
import { CNavLink } from '@coreui/react'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { updateApp } from '../../redux/features/siteNavigation/slice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faBoltLightning, faBolt } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('home'))
  const updateActiveApp = (newApp) => {
    dispatch(updateApp(newApp))
  }
  return (
    <>
      <center>
        <h3>Pretty Good Apps: Brainstorm</h3>
        <strong>
          playground for application of the tapestry protocol to nostr and Web of Trust
        </strong>
        <br /><br />
        <div>This site is under construction!</div>
        <br />
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
