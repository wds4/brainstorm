import React from 'react'
import { CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateApp } from '../../redux/features/siteNavigation/slice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faBoltLightning, faBolt } from '@fortawesome/free-solid-svg-icons'
import WikiListener from '../../helpers/listeners/WikiListener'
import { cilThumbUp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Dashboard = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const dispatch = useDispatch()
  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }
  return (
    <>
      <center>
        <h3>Pretty Good Apps: Brainstorm</h3>
        <br />
        <br />
      </center>
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CCard style={{ width: '100%' }} className="mb-3 border-info" textColor="info">
              <CNavLink
                style={{ display: 'inline-block' }}
                href="#/nostrapedia"
                onClick={() => dispatch(updateApp('wiki'))}
              >
                <CCardHeader>
                  <strong>Nostrapedia</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>
                    created and curated by your Grapevine!
                  </CCardText>
                </CCardBody>
              </CNavLink>
            </CCard>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3} className={loggedInClassName}>
            <CCard style={{ width: '100%' }} className="mb-3 border-primary" textColor="primary">
              <CNavLink
                style={{ display: 'inline-block' }}
                href="#/grapevine"
                onClick={() => dispatch(updateApp('grapevine'))}
              >
                <CCardHeader>
                  <strong>Grapevine</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>Calculation of DoS, WoT and Influence Scores</CCardText>
                </CCardBody>
              </CNavLink>
            </CCard>
          </CCol>
        </CRow>
      </DocsExample>
    </>
  )
}

export default Dashboard

// <WikiListener />
