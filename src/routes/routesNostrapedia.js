import React from 'react'

// Dashboard
const Wiki = React.lazy(() => import('src/views/wikifreedia/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/wiki/Settings'))

// About
const NostrapediaAbout = React.lazy(() => import('src/views/wikifreedia/about/About'))

// content
const Categories = React.lazy(() => import('src/views/wikifreedia/categories/Categories'))
const MakeNewArticle = React.lazy(() =>
  import('src/views/wikifreedia/makeNewArticle/MakeNewArticle'),
)
const WikiArticles = React.lazy(() => import('src/views/wikifreedia/wikiArticles/WikiArticles'))
const WikiCategory = React.lazy(() => import('src/views/wikifreedia/singleCategory/SingleCategory'))
const WikiEntry = React.lazy(() => import('src/views/wikifreedia/singleEntry/SingleEntry'))
const WikiTopic = React.lazy(() => import('src/views/wikifreedia/singleTopic/SingleTopic'))
const WikiAuthors = React.lazy(() => import('src/views/wikifreedia/authors/Authors'))

// WoT
const LeaveAttestation = React.lazy(() =>
  import('src/views/wikifreedia/leaveAttestation/LeaveAttestation'),
)
const ViewAttestations = React.lazy(() =>
  import('src/views/wikifreedia/viewTrustAttestations/ViewTrustAttestations'),
)
const WotScores = React.lazy(() => import('src/views/wikifreedia/wotScores/WotScores'))

const routes = [
  { path: '/wikifreedia', name: 'Wiki', element: Wiki },
  { path: '/wikifreedia/settings', name: 'Settings', element: Settings },

  // about
  { path: '/wikifreedia/about', name: 'About', element: NostrapediaAbout },

  // content
  { path: '/wikifreedia/publish', name: 'Publish', element: MakeNewArticle },
  { path: '/wikifreedia/categories', name: 'Categories', element: Categories },
  { path: '/wikifreedia/wikiArticles', name: 'Topics', element: WikiArticles },
  { path: '/wikifreedia/authors', name: 'Authors', element: WikiAuthors },
  { path: '/wikifreedia/singleCategory', name: 'Wiki Category', element: WikiCategory },
  { path: '/wikifreedia/singleEntry', name: 'Wiki Entry', element: WikiEntry },
  { path: '/wikifreedia/singleTopic', name: 'Wiki Topic', element: WikiTopic },

  // Wiki WoT
  { path: '/wikifreedia/leaveAttestation', name: 'Leave Attestation', element: LeaveAttestation },
  { path: '/wikifreedia/viewAttestations', name: 'View Attestations', element: ViewAttestations },
  { path: '/wikifreedia/wotScores', name: 'WoT Scores', element: WotScores },
]

export default routes
