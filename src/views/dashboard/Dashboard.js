import React from 'react'
import { CNavLink, CRow } from '@coreui/react'
import { DocsExample } from 'src/components'
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
        <br />
        <br />
      </center>
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink
              style={{ display: 'inline-block' }}
              href="#/wikifreedia"
              onClick={() => updateActiveApp('wikifreedia')}
            >
              <CCard className="mb-3 border-primary" textColor="primary">
                <CCardHeader>
                  <strong>Wiki</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>Knowledge curation by your Grapevine</CCardText>
                </CCardBody>
              </CCard>
            </CNavLink>
          </CCol>
        </CRow>
      </DocsExample>
    </>
  )
}

export default Dashboard
