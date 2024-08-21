import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cibWikipedia, cilInfo, cilSpeedometer, cilUser } from '@coreui/icons'
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
    component: CNavItem,
    name: 'Export Grapevine WoT List',
    to: '/grapevine/actions/export',
    icon: <CIcon icon={cilInfo} customClassName="share-icon" />,
  },
]

export default _nav
