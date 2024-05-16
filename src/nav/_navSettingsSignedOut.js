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
]

export default _nav
