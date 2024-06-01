import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApple,
  cilBolt,
  cilBoltCircle,
  cilCalculator,
  cilCircle,
  cilGraph,
  cilHome,
  cilSpeedometer,
  cilThumbUp,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Grapevine Home',
    to: '/grapevine',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Calculate Influence Scores',
    to: '/grapevine/calculateInfluenceScores',
    icon: <CIcon icon={cilThumbUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Calculate WoT Scores',
    to: '/grapevine/calculateWotScores',
    icon: <CIcon icon={cilThumbUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Calculate Degrees of Separation Scores',
    to: '/grapevine/calculateDosScores',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
]

export default _nav
