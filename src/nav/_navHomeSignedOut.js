import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibWikipedia, cilSettings, cilSpeedometer, cilUser } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Wiki',
    to: '/wikifreedia',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
]

export default _nav
