import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilPencil, cilSettings, cilSpeedometer } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'General Settings',
    to: '/settings',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Apps',
  },
  {
    component: CNavItem,
    name: 'Nostrapedia Settings',
    to: '/settings/wiki',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr Settings',
    to: '/settings/twittr',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Tapestry',
  },
  {
    component: CNavItem,
    name: 'Grapevine Settings',
    to: '/settings/grapevine',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Concept Graph Settings',
    to: '/settings/conceptGraph',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Apps Stubs (under development)',
  },
  {
    component: CNavItem,
    name: 'Nostr Apps Directory',
    to: '/settings/nostrAppsDirectory',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Technical',
  },
  {
    component: CNavItem,
    name: 'Database',
    to: '/settings/database',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Relays',
    to: '/settings/relays',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Developer',
    to: '/settings/developer',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
