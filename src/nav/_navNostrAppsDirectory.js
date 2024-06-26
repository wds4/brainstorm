import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilGraph, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Nostr Apps Directory',
    to: '/nostrAppsDirectory',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

export default _nav
