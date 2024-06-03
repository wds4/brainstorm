import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibWikipedia, cilCalculator, cilCircle, cilGlobeAlt, cilGraph, cilHome, cilInfo, cilListFilter, cilListHighPriority, cilPencil, cilPeople, cilSpeedometer, cilThumbUp } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Nostrapedia Home',
    to: '/nostrapedia',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Publish',
    to: '/nostrapedia/publish',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'View Content',
  },
  {
    component: CNavItem,
    name: 'Topics',
    to: '/nostrapedia/topics',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/nostrapedia/categories',
    icon: <CIcon icon={cilCircle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Authors',
    to: '/nostrapedia/authors',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'About',
  },
  {
    component: CNavItem,
    name: 'About Nostrapedia',
    to: '/nostrapedia/about',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
]

export default _nav
