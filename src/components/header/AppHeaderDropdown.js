import React from 'react'
import {
  CAvatar,
  CBadge,
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
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useDispatch, useSelector } from 'react-redux'
import { wipeActiveProfile } from '../../redux/features/profile/slice'

const AppHeaderDropdown = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const myPictureUrl = useSelector((state) => state.profile.picture)
  const dispatch = useDispatch()
  const runLogout = () => {
    dispatch(wipeActiveProfile())
  }
  let loggedOut = 'show'
  let loggedIn = 'hide'
  if (signedIn) {
    loggedOut = 'hide'
    loggedIn = 'show'
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={myPictureUrl} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <div className={loggedIn}>
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem href="#/myProfile/myProfile">
            <CIcon icon={cilUser} className="me-2" />
            My Profile
          </CDropdownItem>
          <CDropdownItem href="#/notifications">
            <CIcon icon={cilBell} className="me-2" />
            Notifications
          </CDropdownItem>
          <CDropdownItem href="#/directMessages">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages
          </CDropdownItem>
        </div>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#/settings/generalSettings">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#/settings/relays">
          <CIcon icon={cilMemory} className="me-2" />
          Relays
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={runLogout} href="#" className={loggedIn}>
          <CIcon icon={cilArrowThickFromRight} className="me-2" />
          Logout
        </CDropdownItem>
        <CDropdownItem href="#/login" className={loggedOut}>
          <CIcon icon={cilArrowThickFromLeft} className="me-2" />
          Login
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
