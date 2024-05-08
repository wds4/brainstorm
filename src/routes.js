import routesMain from 'src/routes/routesMain'
import routesConceptGraph from 'src/routes/routesConceptGraph'
import routesGrapevine from 'src/routes/routesGrapevine'
import routesTwittr from 'src/routes/routesTwittr'
import routesNestedLists from 'src/routes/routesNestedLists'
import routesWikifreedia from 'src/routes/routesWikifreedia'

const routes = [
  ...routesMain,
  ...routesConceptGraph,
  ...routesGrapevine,
  ...routesTwittr,
  ...routesNestedLists,
  ...routesWikifreedia,
]

export default routes
