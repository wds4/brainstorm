import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibTwitter, cibWikipedia, cilInfo, cilSpeedometer, cilUser } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'About',
  },
  {
    component: CNavItem,
    name: 'About',
    to: '/about',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Apps',
  },
  {
    component: CNavItem,
    name: 'Wiki',
    to: '/wikifreedia',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Twittr',
    to: '/twittr',
    icon: <CIcon icon={cibTwitter} customClassName="nav-icon" />,
  },
]

export default _nav

/*
  {
    component: CNavTitle,
    name: 'My Profile',
  },
  {
    component: CNavGroup,
    name: 'MyProfile',
    to: '/myProfile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'MyProfile',
        to: '/myProfile/myProfile',
      },
      {
        component: CNavItem,
        name: 'Follows',
        to: '/myProfile/follows',
      },
    ],
  },
*/
