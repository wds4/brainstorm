import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import FollowsCoreuiTable from 'src/views/components/FollowsCoreuiTable'
import {
  turnListenerOn,
  updateFilter,
  updateListenerApplication,
} from '../../../redux/features/listenerManager/slice'
import { updateApp } from '../../../redux/features/siteNavigation/slice'

const Follows = () => {
  const aFollows = useSelector((state) => state.profile.kind3.follows)

  const dispatch = useDispatch()

  // * manage listener
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod != 'off') {
    const filter = {
      kinds: [0, 3],
      authors: aFollows,
    }
    dispatch(updateApp('home'))
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
    dispatch(updateListenerApplication('home'))
  }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Follows</strong>
            </CCardHeader>
            <CCardBody>
              <FollowsCoreuiTable aFollows={aFollows} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Follows
