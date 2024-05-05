import routesMain from 'src/routes/routesMain'
import routesConceptGraph from 'src/routes/routesConceptGraph'
import routesGrapevine from 'src/routes/routesGrapevine'
import routesTwittr from 'src/routes/routesTwittr'
import routesNestedLists from 'src/routes/routesNestedLists'

const routes = [
  ...routesMain,
  ...routesConceptGraph,
  ...routesGrapevine,
  ...routesTwittr,
  ...routesNestedLists,
]

export default routes
