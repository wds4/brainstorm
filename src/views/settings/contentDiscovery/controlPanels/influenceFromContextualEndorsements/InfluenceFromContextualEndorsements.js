import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CCardTitle,
  CFormLabel,
  CFormRange,
  CNavLink,
  CFormSelect,
  CPopover,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateContentDiscoveryRigor,
  wipeGrapevine,
} from '../../../../../redux/features/grapevine/slice'
// import InfluenceCalculations from './influenceCalculations'
import { defContDiscRigor } from '../../../../../const'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

const InfluenceFromFollowsControlPanel = () => {
  const dispatch = useDispatch()

  const rigorState = Number(
    useSelector((state) => state.grapevine.controlPanels.contentDiscovery.rigor),
  )

  const [rigor, setContentDiscoveryRigor] = useState(rigorState)

  const changeContentDiscoveryRigor = useCallback(async (newValue) => {
    setContentDiscoveryRigor(newValue)
    dispatch(updateContentDiscoveryRigor(newValue))
  }, [])
  const resetParameters = () => {
    // dispatch(wipeGrapevine())
    changeContentDiscoveryRigor(defContDiscRigor)
  }
  return (
    <>
      <br />
      <br />
      <CRow>
        <div>
          Here you will find various parameters that are used in the calculation of Contextual
          Influence Scores via interpretation of Contextual Endorsements.
        </div>
      </CRow>
      <br />
      <CRow>
        <div>
          Disclaimer:{' '}
          <span style={{ color: 'orange' }}>
            IT IS NOT REQUIRED FOR YOU TO DO ANYTHING WITH THESE SETTINGS. THE DEFAULT VALUES ARE
            CHOSEN TO WORK FOR THE VAST MAJORITY OF PEOPLE IN THE VAST MAJORITY OF SCENARIOS.
          </span>{' '}
          (Remember this the next time someone says the Grapevine protocol is "too complicated" !!)
        </div>
      </CRow>
      <br />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Content Discovery Rigor</strong>
              <span style={{ color: 'grey', marginLeft: '5px' }}>
                <CPopover
                  content="The Rigor is a parameter in the equation that calculates the confidence in an average score from the amount of input that went into determining that score."
                  placement="top"
                  trigger={['hover', 'focus']}
                >
                  <CIcon icon={cilInfo} size="lg" />
                </CPopover>
              </span>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Rigor</strong> <small>range: from 0 (most lax) to 100 (most strict)</small>
              </CFormLabel>
              <CCardTitle>{rigor}</CCardTitle>
              <CFormRange
                onChange={(e) => changeContentDiscoveryRigor(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={rigor}
                id="scoreScrollbar"
              />
            </CCardBody>
          </CCard>
          <CButton color="primary" onClick={resetParameters}>
            Reset parameters to recommended values
          </CButton>
        </CCol>
      </CRow>
      <br />
    </>
  )
}

export default InfluenceFromFollowsControlPanel
