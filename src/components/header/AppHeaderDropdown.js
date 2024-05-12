import React from 'react'
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilArrowThickFromRight,
  cilArrowThickFromLeft,
  cilMemory,
  cibTwitter,
  cibWikipedia,
  cilList,
  cilApple,
  cilGraph,
  cilHome,
  cilInfo,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useDispatch, useSelector } from 'react-redux'
import { wipeActiveProfile } from '../../redux/features/profile/slice'
import { updateApp, wipeSiteNavigation } from '../../redux/features/siteNavigation/slice'
import { wipeGrapevine } from '../../redux/features/grapevine/slice'
import { updateDevelopmentMode, wipeSettings } from '../../redux/features/settings/slice'
import { wipeTwittr } from '../../redux/features/twittr/slice'
import sessionStorage from 'redux-persist/es/storage/session'
import localStorage from 'redux-persist/es/storage'
import { wipeConceptGraph } from '../../redux/features/conceptGraph/slice'
import { wipeWikifreedia } from '../../redux/features/wikifreedia/slice'

const AppHeaderDropdown = () => {
  const developmentMode = useSelector((state) => state.settings.general.developmentMode)
  const signedIn = useSelector((state) => state.profile.signedIn)
  const myPictureUrl = useSelector((state) => state.profile.picture)
  const dispatch = useDispatch()
  const runLogout = () => {
    dispatch(wipeActiveProfile())
    dispatch(wipeGrapevine())
    dispatch(wipeSettings())
    dispatch(wipeTwittr())
    dispatch(wipeConceptGraph())
    dispatch(wipeWikifreedia())
    dispatch(wipeSiteNavigation())
    dispatch(updateDevelopmentMode('hide'))
    // sessionStorage.clear()
    // localStorage.clear()
    updateActiveApp('home')
  }
  let loggedOut = 'show'
  let loggedIn = 'hide'
  let headerAvatar = ''
  if (signedIn) {
    loggedOut = 'hide'
    loggedIn = 'show'
    headerAvatar = myPictureUrl
  }
  const updateActiveApp = (newApp) => {
    dispatch(updateApp(newApp))
  }

  let devModeClassName = developmentMode
  if (!signedIn) {
    devModeClassName = 'hide'
  }
  return (
    <>
      <CButton href="#/login" color="primary" className={loggedOut}>
        Login
      </CButton>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar style={{ backgroundColor: 'grey' }} src={headerAvatar} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
            Pretty Good Apps
          </CDropdownHeader>
          <CDropdownItem href="#" onClick={() => updateActiveApp('home')}>
            <CIcon icon={cilHome} className="me-2" />
            Home
          </CDropdownItem>
          <CDropdownItem
            className={devModeClassName}
            href="#/conceptGraph"
            onClick={() => updateActiveApp('conceptGraph')}
          >
            <CIcon icon={cilGraph} className="me-2" />
            Concept Graph
          </CDropdownItem>
          <CDropdownItem
            className={devModeClassName}
            href="#/grapevine"
            onClick={() => updateActiveApp('grapevine')}
          >
            <CIcon icon={cilApple} className="me-2" />
            Grapevine
          </CDropdownItem>
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Apps</CDropdownHeader>
          <CDropdownItem
            className={devModeClassName}
            href="#/nestedLists"
            onClick={() => updateActiveApp('nestedLists')}
          >
            <CIcon icon={cilList} className="me-2" />
            Nested Lists
          </CDropdownItem>
          <CDropdownItem
            className={devModeClassName}
            href="#/curatedLists"
            onClick={() => updateActiveApp('curatedLists')}
          >
            <CIcon icon={cilList} className="me-2" />
            Curated Lists
          </CDropdownItem>
          <CDropdownItem href="#/wikifreedia" onClick={() => updateActiveApp('wikifreedia')}>
            <CIcon icon={cibWikipedia} className="me-2" />
            Wiki
          </CDropdownItem>
          <CDropdownItem
            href="#/twittr"
            onClick={() => updateActiveApp('twittr')}
            className={loggedIn}
          >
            <CIcon icon={cibTwitter} className="me-2" />
            Twittr
          </CDropdownItem>
          <div className={loggedIn}>
            <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
              Account
            </CDropdownHeader>
            <CDropdownItem href="#/myProfile/myProfile" onClick={() => updateActiveApp('home')}>
              <CIcon icon={cilUser} className="me-2" />
              My Profile
            </CDropdownItem>
            <CDropdownItem
              className={devModeClassName}
              href="#/notifications"
              onClick={() => updateActiveApp('home')}
            >
              <CIcon icon={cilBell} className="me-2" />
              Notifications
            </CDropdownItem>
            <CDropdownItem
              className={devModeClassName}
              href="#/directMessages"
              onClick={() => updateActiveApp('home')}
            >
              <CIcon icon={cilEnvelopeOpen} className="me-2" />
              Messages
            </CDropdownItem>
          </div>
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownItem
            className={devModeClassName}
            href="#/settings/settings"
            onClick={() => updateActiveApp('home')}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownItem className={devModeClassName} href="#/settings/relays">
            <CIcon icon={cilMemory} className="me-2" />
            Relays
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={runLogout} href="#" className={loggedIn}>
            <CIcon icon={cilArrowThickFromRight} className="me-2" />
            Logout
          </CDropdownItem>
          <CDropdownItem
            href="#/login"
            className={loggedOut}
            onClick={() => updateActiveApp('home')}
          >
            <CIcon icon={cilArrowThickFromLeft} className="me-2" />
            Login
          </CDropdownItem>
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
            Brainstorm
          </CDropdownHeader>
          <CDropdownItem href="#/about" onClick={() => updateActiveApp('home')}>
            <CIcon icon={cilInfo} className="me-2" />
            About
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown
