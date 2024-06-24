import React, { useEffect } from 'react'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import ContentDiscoveryListener from '../../helpers/listeners/ContentDiscoveryListener'
import CIcon from '@coreui/icons-react'
import { cilFire } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { createContentDiscoveryControlPanel } from '../../redux/features/grapevine/slice'

const ContentDiscoveryDashboard = () => {
  const oGrapevineControlPanels = useSelector((state) => state.grapevine.controlPanels)
  const dispatch = useDispatch()
  useEffect(() => {
    // update store if account was created and logged in prior to what will likely become the v0.3.0 update; only need to do this one time per user.
    // May replace this with a more generalized review of the redux store to make sure it is up to date
    if (!oGrapevineControlPanels.contentDiscovery) {
      dispatch(createContentDiscoveryControlPanel())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
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
