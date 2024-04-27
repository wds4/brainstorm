import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilGraph, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Concept Graph',
    to: '/conceptGraph',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Words',
    to: '/conceptGraph/words',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Words',
        to: '/conceptGraph/words/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Word',
        to: '/conceptGraph/words/makeNew',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Concept Graphs',
    to: '/conceptGraph/conceptGraphs',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Concept Graphs',
        to: '/conceptGraph/conceptGraphs/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Concept Graph',
        to: '/conceptGraph/conceptGraphs/makeNew',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Word Types',
    to: '/conceptGraph/wordTypes',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Word Types',
        to: '/conceptGraph/wordTypes/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Word Type',
        to: '/conceptGraph/wordTypes/makeNew',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Relationship Types',
    to: '/conceptGraph/relationshipTypes',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All Relationship Types',
        to: '/conceptGraph/relationshipTypes/viewAll',
      },
      {
        component: CNavItem,
        name: 'Make New Relationship Type',
        to: '/conceptGraph/relationshipTypes/makeNew',
      },
    ],
  },
]

export default _nav
