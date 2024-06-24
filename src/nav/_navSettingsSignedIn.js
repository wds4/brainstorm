import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilGraph, cilPencil, cilSettings, cilSpeedometer, cilThumbUp } from '@coreui/icons'
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
    name: 'Content Discovery Settings',
    to: '/settings/contentDiscovery',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Technical',
  },
  {
    component: CNavItem,
    name: 'Developer',
    to: '/settings/developer',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
