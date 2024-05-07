import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cilGraph, cilNoteAdd, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Twittr',
    to: '/twittr',
    icon: <CIcon icon={cibTwitter} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr Main Feed',
    to: '/twittr/mainFeed',
    icon: <CIcon icon={cibTwitter} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr Post Note',
    to: '/twittr/postNote',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
]

export default _nav
