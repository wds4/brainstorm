import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibWikipedia, cilCalculator, cilCircle, cilGlobeAlt, cilGraph, cilListFilter, cilListHighPriority, cilPencil, cilPeople, cilSpeedometer, cilThumbUp } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Wiki Dashboard',
    to: '/wikifreedia',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
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
  {
    component: CNavTitle,
    name: 'Web of Trust',
  },
  {
    component: CNavItem,
    name: 'Leave Trust Attestation',
    to: '/wikifreedia/leaveAttestation',
    icon: <CIcon icon={cilThumbUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Trust Attestations',
    to: '/wikifreedia/viewAttestations',
    icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'WoT Scores',
    to: '/wikifreedia/wotScores',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
]

export default _nav
