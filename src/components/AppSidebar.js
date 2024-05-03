import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from 'src/components/AppSidebarNav'

// sidebar nav config
import navigationHomeSignedIn from 'src/nav/_navHomeSignedIn'
import navigationHomeSignedOut from 'src/nav/_navHomeSignedOut'
import navigationConceptGraph from 'src/nav/_navConceptGraph'
import navigationGrapevine from 'src/nav/_navGrapevine'
import { updateSidebarShow, updateSidebarUnfoldable } from 'src/redux/features/ui/slice'
import { updateApp } from 'src/redux/features/siteNavigation/slice'

function getNavigation(activeApp, signedIn) {
  switch (activeApp) {
    case 'home':
      if (!signedIn) {
        return navigationHomeSignedOut
      }
      return navigationHomeSignedIn
    case 'conceptGraph':
      return navigationConceptGraph
    case 'grapevine':
      return navigationGrapevine
    case 'curatedLists':
      return navigationHome
    case 'wikifreedia':
      return navigationHome
    case 'twittr':
      return navigationHome
    default:
      return navigationHome
  }
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const activeApp = useSelector((state) => state.siteNavigation.app)
  const signedIn = useSelector((state) => state.profile.signedIn)

  const updateActiveApp = (newApp) => {
    dispatch(updateApp(newApp))
  }

  const navigation = getNavigation(activeApp, signedIn)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(updateSidebarShow(visible))
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          href="#/dashboard"
          onClick={() => updateActiveApp('home')}
          style={{ textDecoration: 'none', fontSize: '22px', fontFamily: 'capitals' }}
        >
          Pretty Good Apps
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => dispatch(updateSidebarUnfoldable(!unfoldable))} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
