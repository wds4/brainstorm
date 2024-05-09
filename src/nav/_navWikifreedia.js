import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibWikipedia, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Wikifreedia Dashboard',
    to: '/wikifreedia',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Content',
  },
  {
    component: CNavItem,
    name: 'Articles',
    to: '/wikifreedia/wikiArticles',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Make New Wiki Article',
    to: '/wikifreedia/makeNewArticle',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/wikifreedia/categories',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Web of Trust',
  },
  {
    component: CNavItem,
    name: 'Leave Trust Attestation',
    to: '/wikifreedia/leaveAttestation',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Trust Attestations',
    to: '/wikifreedia/viewAttestations',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'WoT Scores',
    to: '/wikifreedia/wotScores',
    icon: <CIcon icon={cibWikipedia} customClassName="nav-icon" />,
  },
]

export default _nav
