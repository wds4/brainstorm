import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApple,
  cilBolt,
  cilBoltCircle,
  cilCalculator,
  cilCircle,
  cilFire,
  cilGraph,
  cilHome,
  cilInfo,
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
    component: CNavTitle,
    name: 'Calculate',
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
  {
    component: CNavItem,
    name: 'Calculate Contextual Influence Scores',
    to: '/grapevine/calculateContextualInfluenceScores',
    icon: <CIcon icon={cilFire} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'About',
  },
  {
    component: CNavItem,
    name: 'Influence Score',
    to: '/grapevine/influenceScore',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'WoT Score',
    to: '/grapevine/wotScore',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'DoS Score',
    to: '/grapevine/dosScore',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Score Comparisons',
    to: '/grapevine/scoreComparisons',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
]

export default _nav
