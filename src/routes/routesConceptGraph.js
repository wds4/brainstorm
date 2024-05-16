import React from 'react'

// Dashboard
const ConceptGraph = React.lazy(() => import('src/views/conceptGraph/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/conceptGraph/Settings'))

// Words
const Words = React.lazy(() => import('src/views/conceptGraph/words'))
const ViewAllWords = React.lazy(() => import('src/views/conceptGraph/words/viewAll/ViewAll'))
const MakeNewWord = React.lazy(() => import('src/views/conceptGraph/words/makeNew/MakeNew'))
const ViewSingleWord = React.lazy(() =>
  import('src/views/conceptGraph/words/viewSingle/ViewSingle'),
)

// WordTypes
const WordTypes = React.lazy(() => import('src/views/conceptGraph/wordTypes'))
const ViewAllWordTypes = React.lazy(() =>
  import('src/views/conceptGraph/wordTypes/viewAll/ViewAll'),
)
const MakeNewWordType = React.lazy(() => import('src/views/conceptGraph/wordTypes/makeNew/MakeNew'))
const ViewSingleWordType = React.lazy(() =>
  import('src/views/conceptGraph/wordTypes/viewSingle/ViewSingle'),
)

// RelationshipTypes
const RelationshipTypes = React.lazy(() => import('src/views/conceptGraph/relationshipTypes'))
const ViewAllRelationshipTypes = React.lazy(() =>
  import('src/views/conceptGraph/relationshipTypes/viewAll/ViewAll'),
)
const MakeNewRelationshipType = React.lazy(() =>
  import('src/views/conceptGraph/relationshipTypes/makeNew/MakeNew'),
)
const ViewSingleRelationshipType = React.lazy(() =>
  import('src/views/conceptGraph/relationshipTypes/viewSingle/ViewSingle'),
)

// ConceptGraphs
const ConceptGraphs = React.lazy(() => import('src/views/conceptGraph/conceptGraphs'))
const ViewAllConceptGraphs = React.lazy(() =>
  import('src/views/conceptGraph/conceptGraphs/viewAll/ViewAll'),
)
const MakeNewConceptGraph = React.lazy(() =>
  import('src/views/conceptGraph/conceptGraphs/makeNew/MakeNew'),
)

const routes = [
  { path: '/conceptGraph', name: 'Concept Graph', element: ConceptGraph },
  { path: '/conceptGraph/settings', name: 'Settings', element: Settings },

  // Words
  { path: '/conceptGraph/words', name: 'Words', element: Words },
  { path: '/conceptGraph/words/makeNew', name: 'Make New Word', element: MakeNewWord },
  { path: '/conceptGraph/words/viewAll', name: 'View All Words', element: ViewAllWords },
  { path: '/conceptGraph/words/viewSingle', name: 'View Single Word', element: ViewSingleWord },

  // Word Types
  { path: '/conceptGraph/wordTypes', name: 'Word Types', element: WordTypes },
  { path: '/conceptGraph/wordTypes/makeNew', name: 'Make New Word Type', element: MakeNewWordType },
  {
    path: '/conceptGraph/wordTypes/viewAll',
    name: 'View All Word Types',
    element: ViewAllWordTypes,
  },
  {
    path: '/conceptGraph/wordTypes/viewSingle',
    name: 'View Single Word Type',
    element: ViewSingleWordType,
  },

  // Relationship Types
  {
    path: '/conceptGraph/relationshipTypes',
    name: 'Relationship Types',
    element: RelationshipTypes,
  },
  {
    path: '/conceptGraph/relationshipTypes/makeNew',
    name: 'Make New Relationship Type',
    element: MakeNewRelationshipType,
  },
  {
    path: '/conceptGraph/relationshipTypes/viewAll',
    name: 'View All Relationship Types',
    element: ViewAllRelationshipTypes,
  },
  {
    path: '/conceptGraph/relationshipTypes/viewSingle',
    name: 'View Single Relationship Type',
    element: ViewSingleRelationshipType,
  },

  // Concept Graphs
  { path: '/conceptGraph/conceptGraphs', name: 'Concept Graphs', element: ConceptGraphs },
  {
    path: '/conceptGraph/conceptGraphs/makeNew',
    name: 'Make New Concept Graph',
    element: MakeNewConceptGraph,
  },
  {
    path: '/conceptGraph/conceptGraphs/viewAll',
    name: 'View All Concept Graphs',
    element: ViewAllConceptGraphs,
  },
]

export default routes
