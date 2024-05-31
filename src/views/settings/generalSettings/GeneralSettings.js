import React, { useCallback, useState } from 'react'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilBoltCircle, cilCircle, cilGraph, cilThumbUp } from '@coreui/icons'
import { useSelector } from 'react-redux'

const GeneralSettings = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  console.log('GeneralSettings')
  return (
    <>
      <center>
        <h4>General Settings</h4>
        <div>{Object.keys(oProfilesByNpub).length} profiles currently</div>
      </center>
      <br />
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/settings/influenceScores">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title="title"
                value="recalculate Influence Scores"
                color="info"
              />
            </CNavLink>
          </CCol>

          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/settings/wotScores">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title="title"
                value="recalculate WoT Scores"
                color="info"
              />
            </CNavLink>
          </CCol>

          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/settings/dosScores">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilGraph} size="xl" />}
                title="title"
                value="recalculate Degrees of Separation Scores"
                color="info"
              />
            </CNavLink>
          </CCol>
        </CRow>
      </DocsExample>
    </>
  )
}

export default GeneralSettings
