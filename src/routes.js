import routesMain from 'src/routes/routesMain'
import routesConceptGraph from 'src/routes/routesConceptGraph'
import routesGrapevine from 'src/routes/routesGrapevine'
import routesTwittr from 'src/routes/routesTwittr'
import routesNestedLists from 'src/routes/routesNestedLists'
import routesNip51Lists from 'src/routes/routesNip51Lists'
import routesCuratedLists from 'src/routes/routesCuratedLists'
import routesNostrapedia from 'src/routes/routesNostrapedia'
import routesHelloWorld from 'src/routes/routesHelloWorld'
import routesNostrAppsDirectory from 'src/routes/routesNostrAppsDirectory'
import routesRelaysDirectory from 'src/routes/routesRelaysDirectory'
import routesSettings from 'src/routes/routesSettings'

const routes = [
  ...routesMain,
  ...routesConceptGraph,
  ...routesGrapevine,
  ...routesTwittr,
  ...routesNestedLists,
  ...routesNip51Lists,
  ...routesCuratedLists,
  ...routesNostrapedia,
  ...routesHelloWorld,
  ...routesNostrAppsDirectory,
  ...routesRelaysDirectory,
  ...routesSettings,
]

export default routes
