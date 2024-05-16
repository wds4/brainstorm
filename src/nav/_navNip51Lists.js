import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilGraph, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'NIP-51 Lists',
    to: '/nip51Lists',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

export default _nav
