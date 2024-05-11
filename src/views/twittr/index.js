import React from 'react'
import { useDispatch } from 'react-redux'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { updateApp } from 'src/redux/features/siteNavigation/slice'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilPencil } from '@coreui/icons'

const TwittrDashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('twittr'))
  return (
    <>
      <center>
        <h3>Twittr Dashboard</h3>
        <div>This app is under construction!</div>
      </center>
      <CRow xs={{ gutter: 4 }}>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/twittr/postNote">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cilPencil} size="xl" />}
              value="Post a note!"
              color="success"
            />
          </CNavLink>
        </CCol>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/twittr/mainFeed">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cibTwitter} size="xl" />}
              value="main feed"
              color="primary"
            />
          </CNavLink>
        </CCol>
      </CRow>
    </>
  )
}

export default TwittrDashboard
