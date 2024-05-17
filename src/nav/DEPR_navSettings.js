import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilPencil, cilSettings, cilSpeedometer } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Settings Dashboard',
    to: '/settings',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Basic',
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
    component: CNavTitle,
    name: 'Apps',
  },
  {
    component: CNavItem,
    name: 'Wiki',
    to: '/settings/wiki',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr',
    to: '/settings/twittr',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Tapestry',
  },
  {
    component: CNavItem,
    name: 'Grapevine',
    to: '/settings/grapevine',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Concept Graph',
    to: '/settings/conceptGraph',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
