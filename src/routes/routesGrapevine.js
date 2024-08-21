import React from 'react'

// Dashboard
const Grapevine = React.lazy(() => import('src/views/grapevine/index'))
const GrapevineDashboard = React.lazy(() => import('src/views/grapevine/dashboard/Dashboard'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/grapevine/Settings'))

// About
const GrapevineScoreComparisons = React.lazy(
  () => import('src/views/grapevine/about/scoreComparisons'),
)
const AboutWotScore = React.lazy(() => import('src/views/grapevine/about/wotScore'))
const AboutDosScore = React.lazy(() => import('src/views/grapevine/about/dosScore'))
const AboutInfluenceScore = React.lazy(() => import('src/views/grapevine/about/influenceScore'))

const CalculateContextualInfluenceScores = React.lazy(
  () => import('src/views/grapevine/scoreCalculations/contextualInfluenceScores/ContextualInfluenceScores'),
)
const CalculateInfluenceScores = React.lazy(
  () => import('src/views/grapevine/scoreCalculations/influenceScores/InfluenceScores'),
)
const CalculateWotScores = React.lazy(
  () => import('src/views/grapevine/scoreCalculations/wotScores/WotScores'),
)
const CalculateDosScores = React.lazy(
  () => import('src/views/grapevine/scoreCalculations/dosScores/DosScores'),
)

// Actions
const Actions = React.lazy(() => import('src/views/grapevine/actions'))
const ViewAllActions = React.lazy(() => import('src/views/grapevine/actions/viewAll/ViewAll'))
const MakeNewAction = React.lazy(() => import('src/views/grapevine/actions/makeNew/MakeNew'))
const ViewAllActionRelationships = React.lazy(
  () => import('src/views/grapevine/actions/viewAllRelationships/ViewAllRelationships'),
)
const ExportGrapevineList = React.lazy(
  () => import('src/views/grapevine/actions/exportGrapevineList/ExportGrapevineList'),
)
const MakeNewActionRelationship = React.lazy(
  () => import('src/views/grapevine/actions/makeNewRelationship/MakeNewRelationship'),
)

// Categories
const Categories = React.lazy(() => import('src/views/grapevine/categories'))
const ViewAllCategories = React.lazy(() => import('src/views/grapevine/categories/viewAll/ViewAll'))
const MakeNewCategory = React.lazy(() => import('src/views/grapevine/categories/makeNew/MakeNew'))
const ViewAllCategoryRelationships = React.lazy(
  () => import('src/views/grapevine/categories/viewAllRelationships/ViewAllRelationships'),
)
const MakeNewCategoryRelationship = React.lazy(
  () => import('src/views/grapevine/categories/makeNewRelationship/MakeNewRelationship'),
)

// Contexts
const Contexts = React.lazy(() => import('src/views/grapevine/contexts'))
const ViewAllContexts = React.lazy(() => import('src/views/grapevine/contexts/viewAll/ViewAll'))
const MakeNewContext = React.lazy(() => import('src/views/grapevine/contexts/makeNew/MakeNew'))
const ViewSingleContext = React.lazy(
  () => import('src/views/grapevine/contexts/viewSingle/ViewSingle'),
)

// Trust Attestations
const TrustAttestations = React.lazy(() => import('src/views/grapevine/trustAttestations'))
const ViewAllTrustAttestations = React.lazy(
  () => import('src/views/grapevine/trustAttestations/viewAll/ViewAll'),
)
const MakeNewTrustAttestation = React.lazy(
  () => import('src/views/grapevine/trustAttestations/makeNew/MakeNew'),
)

// Influence Scores
const InfluenceScores = React.lazy(() => import('src/views/grapevine/influenceScores'))
const ViewAllInfluenceScores = React.lazy(
  () => import('src/views/grapevine/influenceScores/viewAll/ViewAll'),
)
const RecalculateInfluenceScores = React.lazy(
  () => import('src/views/grapevine/influenceScores/recalculate/Recalculate'),
)

const routes = [
  { path: '/grapevine', name: 'Grapevine', element: Grapevine },
  { path: '/grapevine/settings', name: 'Settings', element: Settings },
  { path: '/grapevine/dashboard', name: 'Dashboard', element: GrapevineDashboard },

  {
    path: '/grapevine/calculateContextualInfluenceScores',
    name: 'Contextual Influence Scores',
    element: CalculateContextualInfluenceScores,
  },
  {
    path: '/grapevine/calculateInfluenceScores',
    name: 'Influence Scores',
    element: CalculateInfluenceScores,
  },
  { path: '/grapevine/calculateWotScores', name: 'WoT Scores', element: CalculateWotScores },
  { path: '/grapevine/calculateDosScores', name: 'DoS Scores', element: CalculateDosScores },

  // About
  {
    path: '/grapevine/scoreComparisons',
    name: 'Score Comparisons',
    element: GrapevineScoreComparisons,
  },
  { path: '/grapevine/wotScore', name: 'WoT Score', element: AboutWotScore },
  { path: '/grapevine/dosScore', name: 'DoS Score', element: AboutDosScore },
  { path: '/grapevine/influenceScore', name: 'Influence Score', element: AboutInfluenceScore },

  // Actions
  { path: '/grapevine/actions', name: 'Actions', element: Actions },
  { path: '/grapevine/actions/makeNew', name: 'Make New Action', element: MakeNewAction },
  { path: '/grapevine/actions/viewAll', name: 'View All Actions', element: ViewAllActions },
  {
    path: '/grapevine/actions/makeNewRelationship',
    name: 'Make New Action Relationship',
    element: MakeNewActionRelationship,
  },
  {
    path: '/grapevine/actions/viewAllRelationships',
    name: 'View All Action Relationships',
    element: ViewAllActionRelationships,
  },
  {
    path: '/grapevine/actions/export',
    name: 'Export',
    element: ExportGrapevineList,
  },

  // Categories
  { path: '/grapevine/categories', name: 'Categories', element: Categories },
  { path: '/grapevine/categories/makeNew', name: 'Make New Category', element: MakeNewCategory },
  {
    path: '/grapevine/categories/viewAll',
    name: 'View All Categories',
    element: ViewAllCategories,
  },
  {
    path: '/grapevine/categories/makeNewRelationship',
    name: 'Make New Category Relationship',
    element: MakeNewCategoryRelationship,
  },
  {
    path: '/grapevine/categories/viewAllRelationships',
    name: 'View All Category Relationships',
    element: ViewAllCategoryRelationships,
  },

  // Contexts
  { path: '/grapevine/contexts', name: 'Contexts', element: Contexts },
  { path: '/grapevine/contexts/makeNew', name: 'Make New Context', element: MakeNewContext },
  {
    path: '/grapevine/contexts/viewAll',
    name: 'View All Contexts',
    element: ViewAllContexts,
  },
  {
    path: '/grapevine/contexts/viewSingle',
    name: 'View Single Context',
    element: ViewSingleContext,
  },

  // Trust Attestations
  { path: '/grapevine/trustAttestations', name: 'Trust Attestations', element: TrustAttestations },
  {
    path: '/grapevine/trustAttestations/makeNew',
    name: 'Make New Trust Attestation',
    element: MakeNewTrustAttestation,
  },
  {
    path: '/grapevine/trustAttestations/viewAll',
    name: 'View All Trust Attestations',
    element: ViewAllTrustAttestations,
  },

  // Influence Scores
  { path: '/grapevine/influenceScores', name: 'Influence Scores', element: InfluenceScores },
  {
    path: '/grapevine/influenceScores/recalculate',
    name: 'Recalculate Influence Scores',
    element: RecalculateInfluenceScores,
  },
  {
    path: '/grapevine/influenceScores/viewAll',
    name: 'View All Influence Scores',
    element: ViewAllInfluenceScores,
  },
]

export default routes
