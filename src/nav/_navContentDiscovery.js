import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilGraph, cilHome, cilInfo, cilMap, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Content Discovery Home',
    to: '/contentDiscovery',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Recommendations',
    to: '/contentDiscovery/recommendations',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'About',
  },
  {
    component: CNavItem,
    name: 'About Content Discovery',
    to: '/contentDiscovery/about',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
]

export default _nav
