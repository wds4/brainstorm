import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilHome, cilPencil, cilSpeedometer } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Twittr Home',
    to: '/twittr',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr Post Note',
    to: '/twittr/postNote',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr Main Feed',
    to: '/twittr/mainFeed',
    icon: <CIcon icon={cibTwitter} customClassName="nav-icon" />,
  },
]

export default _nav
