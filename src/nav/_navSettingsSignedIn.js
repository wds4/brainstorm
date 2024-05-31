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
    component: CNavItem,
    name: 'Calculate Influence Scores',
    to: '/settings/influenceScores',
    icon: <CIcon icon={cilThumbUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Calculate WoT Scores',
    to: '/settings/wotScores',
    icon: <CIcon icon={cilThumbUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Calculate Degrees of Separation Scores',
    to: '/settings/dosScores',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
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
