import React from 'react'

// Dashboard
const Wiki = React.lazy(() => import('src/views/nostrapedia/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/wiki/Settings'))

// About
const NostrapediaAbout = React.lazy(() => import('src/views/nostrapedia/about/About'))

// content
const Categories = React.lazy(() => import('src/views/nostrapedia/categories/Categories'))
const MakeNewArticle = React.lazy(() =>
  import('src/views/nostrapedia/makeNewArticle/MakeNewArticle'),
)
const WikiArticles = React.lazy(() => import('src/views/nostrapedia/wikiArticles/WikiArticles'))
const WikiCategory = React.lazy(() => import('src/views/nostrapedia/singleCategory/SingleCategory'))
const WikiEntry = React.lazy(() => import('src/views/nostrapedia/singleEntry/SingleEntry'))
const WikiTopic = React.lazy(() => import('src/views/nostrapedia/singleTopic/SingleTopic'))
const WikiAuthors = React.lazy(() => import('src/views/nostrapedia/authors/Authors'))

// WoT
const LeaveAttestation = React.lazy(() =>
  import('src/views/nostrapedia/leaveAttestation/LeaveAttestation'),
)
const ViewAttestations = React.lazy(() =>
  import('src/views/nostrapedia/viewTrustAttestations/ViewTrustAttestations'),
)
const WotScores = React.lazy(() => import('src/views/nostrapedia/wotScores/WotScores'))

const routes = [
  { path: '/nostrapedia', name: 'Wiki', element: Wiki },
  { path: '/nostrapedia/settings', name: 'Settings', element: Settings },

  // about
  { path: '/nostrapedia/about', name: 'About', element: NostrapediaAbout },

  // content
  { path: '/nostrapedia/publish', name: 'Publish', element: MakeNewArticle },
  { path: '/nostrapedia/categories', name: 'Categories', element: Categories },
  { path: '/nostrapedia/wikiArticles', name: 'Topics', element: WikiArticles },
  { path: '/nostrapedia/authors', name: 'Authors', element: WikiAuthors },
  { path: '/nostrapedia/singleCategory', name: 'Wiki Category', element: WikiCategory },
  { path: '/nostrapedia/singleEntry', name: 'Wiki Entry', element: WikiEntry },
  { path: '/nostrapedia/singleTopic', name: 'Wiki Topic', element: WikiTopic },

  // Wiki WoT
  { path: '/nostrapedia/leaveAttestation', name: 'Leave Attestation', element: LeaveAttestation },
  { path: '/nostrapedia/viewAttestations', name: 'View Attestations', element: ViewAttestations },
  { path: '/nostrapedia/wotScores', name: 'WoT Scores', element: WotScores },
]

export default routes
