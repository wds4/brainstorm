import React from 'react'
import { CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { updateApp } from '../../redux/features/siteNavigation/slice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faBoltLightning, faBolt } from '@fortawesome/free-solid-svg-icons'
import WikiListener from '../../helpers/listeners/WikiListener'
import { cilThumbUp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Dashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('home'))
  const updateActiveApp = (newApp) => {
    dispatch(updateApp(newApp))
  }
  return (
    <>
      <WikiListener />
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
                href="#/wikifreedia"
                onClick={() => updateActiveApp('wiki')}
              >
                <CCardHeader>
                  <strong>Wiki</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>Nostr meets Wikipedia</CCardText>
                </CCardBody>
              </CNavLink>
            </CCard>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CCard style={{ width: '100%' }} className="mb-3 border-primary" textColor="primary">
              <CNavLink
                style={{ display: 'inline-block' }}
                href="#/grapevine"
                onClick={() => updateActiveApp('grapevine')}
              >
                <CCardHeader>
                  <strong>Grapevine</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>Web of Trust</CCardText>
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
