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
const WikiTopics = React.lazy(() => import('src/views/nostrapedia/topics/Topics'))
const WikiCategory = React.lazy(() => import('src/views/nostrapedia/singleCategory/SingleCategory'))
const WikiArticle = React.lazy(() => import('src/views/nostrapedia/singleArticle/SingleArticle'))
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
  { path: '/nostrapedia/topics', name: 'Topics', element: WikiTopics },
  { path: '/nostrapedia/authors', name: 'Authors', element: WikiAuthors },
  { path: '/nostrapedia/singleCategory', name: 'Wiki Category', element: WikiCategory },
  { path: '/nostrapedia/singleArticle', name: 'Wiki Article', element: WikiArticle },
  { path: '/nostrapedia/singleTopic', name: 'Wiki Topic', element: WikiTopic },

  // Wiki WoT
  { path: '/nostrapedia/leaveAttestation', name: 'Leave Attestation', element: LeaveAttestation },
  { path: '/nostrapedia/viewAttestations', name: 'View Attestations', element: ViewAttestations },
  { path: '/nostrapedia/wotScores', name: 'WoT Scores', element: WotScores },
]

export default routes
