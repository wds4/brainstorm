import routesMain from 'src/routes/routesMain'
import routesConceptGraph from 'src/routes/routesConceptGraph'
import routesGrapevine from 'src/routes/routesGrapevine'
import routesTwittr from 'src/routes/routesTwittr'

const routes = [...routesMain, ...routesConceptGraph, ...routesGrapevine, ...routesTwittr]

export default routes
