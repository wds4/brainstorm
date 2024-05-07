import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApple,
  cilBolt,
  cilBoltCircle,
  cilCalculator,
  cilCircle,
  cilSpeedometer,
  cilThumbUp,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Grapevine Dashboard',
    to: '/grapevine',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Influence Scores',
    to: '/grapevine/influenceScores',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Influence Scores',
        to: '/grapevine/influenceScores/viewAll',
      },
      {
        component: CNavItem,
        name: 'Recalculate Influence Scores',
        to: '/grapevine/influenceScores/recalculate',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Trust Attestations',
    to: '/grapevine/trustAttestations',
    icon: <CIcon icon={cilThumbUp} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Trust Attestations',
        to: '/grapevine/trustAttestations/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Trust Attestation',
        to: '/grapevine/trustAttestations/makeNew',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Contexts',
    to: '/grapevine/contexts',
    icon: <CIcon icon={cilBoltCircle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Contexts',
        to: '/grapevine/contexts/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Context',
        to: '/grapevine/contexts/makeNew',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Actions',
    to: '/grapevine/actions',
    icon: <CIcon icon={cilBolt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Actions',
        to: '/grapevine/actions/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Action',
        to: '/grapevine/actions/makeNew',
      },
      {
        component: CNavItem,
        name: 'View All Action Relationships',
        to: '/grapevine/actions/viewAllRelationships',
      },
      {
        component: CNavItem,
        name: 'Make New Action Relationship',
        to: '/grapevine/actions/makeNewRelationship',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Categories',
    to: '/grapevine/categories',
    icon: <CIcon icon={cilCircle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Categories',
        to: '/grapevine/categories/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Category',
        to: '/grapevine/categories/makeNew',
      },
      {
        component: CNavItem,
        name: 'View All Category Relationships',
        to: '/grapevine/categories/viewAllRelationships',
      },
      {
        component: CNavItem,
        name: 'Make New Category Relationship',
        to: '/grapevine/categories/makeNewRelationship',
      },
    ],
  },
]

export default _nav
