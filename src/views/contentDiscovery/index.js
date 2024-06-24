import React from 'react'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import ContentDiscoveryListener from '../../helpers/listeners/ContentDiscoveryListener'
import CIcon from '@coreui/icons-react'
import { cilFire } from '@coreui/icons'

const ContentDiscoveryDashboard = () => {
  return (
    <>
      <center>
        <h3>Content Discovery Dashboard</h3>
      </center>
      <ContentDiscoveryListener />
      <br />
      <CRow xs={{ gutter: 4 }}>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/contentDiscovery/recommendations">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cilFire} size="xl" />}
              value="Content Discovery Recommendations"
              color="success"
            />
          </CNavLink>
        </CCol>
      </CRow>

    </>
  )
}

export default ContentDiscoveryDashboard
