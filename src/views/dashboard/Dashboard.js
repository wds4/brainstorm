import React from 'react'
import { CButton, CNavLink, CRow } from '@coreui/react'
import { DocsExample } from 'src/components'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateApp } from '../../redux/features/siteNavigation/slice'
import WikiListener from '../../helpers/listeners-ndk/WikiListener'

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
        <h3>Pretty Good Apps: BrainSToRm</h3>
        <br />
        <br />
        <div
          style={{
            textAlign: 'left',
            width: '700px',
            border: '1px solid orange',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          <center><h4>New! Customized Follow Recommendations by your Grapevine!</h4></center>
          <br/>
          <p>
            Step 1: Download profiles and follows data in{' '}
            <CButton href="#/settings/settings" color="primary">
              settings
            </CButton> (may take up to 5-10 minutes)
          </p>
          <p>
            Step 2: Calculate Grapevine Web of Trust Scores in the{' '}
            <CButton href="#/grapevine" color="primary">
              Grapevine app
            </CButton> (should take no more than 2-3 minutes)
          </p>
          <p>
            Step 3: Export NIP-51 lists in the Grapevine{' '}
            <CButton href="#/grapevine/exportGrapevineScores" color="primary">
              export page
            </CButton> (lickity split!)
          </p>
          <p>
            Step 4: Use these lists in all clients with NIP-51 support -- Coracle, Amethyst, and
            more!
          </p>
        </div>
      </center>
      <br />
      <br />
      <center>
        <h4>Apps</h4>
      </center>
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CCard
              style={{ width: '100%', height: '100%' }}
              className="mb-3 border-info"
              textColor="info"
            >
              <CNavLink
                style={{ display: 'inline-block' }}
                href="#/nostrapedia"
                onClick={() => dispatch(updateApp('wiki'))}
              >
                <CCardHeader>
                  <strong>Nostrapedia</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>created and curated by your Grapevine!</CCardText>
                </CCardBody>
              </CNavLink>
            </CCard>
          </CCol>

          <CCol xs={12} sm={6} xl={4} xxl={3} className={loggedInClassName}>
            <CCard
              style={{ width: '100%', height: '100%' }}
              className="mb-3 border-primary"
              textColor="primary"
            >
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

          <CCol xs={12} sm={6} xl={4} xxl={3} className={loggedInClassName}>
            <CCard
              style={{ width: '100%', height: '100%' }}
              className="mb-3 border-primary"
              textColor="success"
            >
              <CNavLink
                style={{ display: 'inline-block' }}
                href="#/contentDiscovery"
                onClick={() => dispatch(updateApp('contentDiscovery'))}
              >
                <CCardHeader>
                  <strong>Content Discovery</strong>
                </CCardHeader>
                <CCardBody>
                  <CCardText>Profiles suggested by your Grapevine!</CCardText>
                </CCardBody>
              </CNavLink>
            </CCard>
          </CCol>
        </CRow>
      </DocsExample>
      <WikiListener />
    </>
  )
}

export default Dashboard
