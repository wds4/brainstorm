import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { updateApp } from 'src/redux/features/siteNavigation/slice'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilPencil } from '@coreui/icons'
import {
  turnListenerOn,
  updateFilter,
  updateFilterAuthors,
  updateFilterKinds,
  updateListenerApplication,
} from '../../redux/features/listenerManager/slice'

const TwittrHome = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const dispatch = useDispatch()
  const aFollows = useSelector((state) => state.profile.kind3.follows)

  // TO DO: add selector so user has option to choose between global filter and following list
  const globalFilter = {
    kinds: [1],
    since: 0,
  }
  const followsFilter = {
    kinds: [1],
    authors: aFollows,
  }
  // manage listener
  dispatch(updateApp('twittr'))
  // dispatch(updateFilter(globalFilter))

  dispatch(updateFilter(followsFilter))
  dispatch(updateFilterKinds([1]))
  dispatch(updateFilterAuthors(aFollows))
  dispatch(turnListenerOn())
  dispatch(updateListenerApplication('twittr'))

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }
  return (
    <>
      <center>
        <h3>Twittr Home</h3>
        <div>This app is under construction!</div>
      </center>
      <CRow xs={{ gutter: 4 }}>
        <CCol xs={12} sm={6} xl={4} xxl={3} className={loggedInClassName}>
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

export default TwittrHome
