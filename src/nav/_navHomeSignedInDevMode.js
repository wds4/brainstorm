import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibTwitter,
  cibWikipedia,
  cilApple,
  cilInfo,
  cilSettings,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'About',
  },
  {
    component: CNavItem,
    name: 'About Brainstorm',
    to: '/about',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'My Profile',
  },
  {
    component: CNavGroup,
    name: 'MyProfile',
    to: '/myProfile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'MyProfile',
        to: '/myProfile/myProfile',
      },
      {
        component: CNavItem,
        name: 'Follows',
        to: '/myProfile/follows',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Apps',
  },
  {
    component: CNavItem,
    name: 'Grapevine',
    to: '/grapevine',
    icon: <CIcon icon={cilApple} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Wiki',
    to: '/nostrapedia',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr',
    to: '/twittr',
    icon: <CIcon icon={cibTwitter} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavGroup,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Settings',
        to: '/settings/settings',
      },
      {
        component: CNavItem,
        name: 'Relays',
        to: '/settings/relays',
      },
    ],
  },
]

export default _nav
