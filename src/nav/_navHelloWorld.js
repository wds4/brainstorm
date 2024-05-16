import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBuilding, cilClipboard, cilGraph, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Hello World',
    to: '/helloWorld',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Test Pages',
  },
  {
    component: CNavItem,
    name: 'Test Page 1',
    to: '/helloWorld/testPage1',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Test Page 2',
    to: '/helloWorld/testPage2',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Test Page 3',
    to: '/helloWorld/testPage3',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Test Page 4',
    to: '/helloWorld/testPage4',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Test Page 5',
    to: '/helloWorld/testPage5',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
]

export default _nav
