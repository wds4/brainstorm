import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibWikipedia, cilCalculator, cilCircle, cilGlobeAlt, cilGraph, cilHome, cilListFilter, cilListHighPriority, cilPencil, cilPeople, cilSpeedometer, cilThumbUp } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Nostrapedia Home',
    to: '/wikifreedia',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Publish',
    to: '/wikifreedia/publish',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'View Content',
  },
  {
    component: CNavItem,
    name: 'Topics',
    to: '/wikifreedia/wikiArticles',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/wikifreedia/categories',
    icon: <CIcon icon={cilCircle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Authors',
    to: '/wikifreedia/authors',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]

export default _nav
