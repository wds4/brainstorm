import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateApp } from '../../redux/features/siteNavigation/slice'
import {
  turnListenerOn,
  updateFilter,
  updateListenerApplication,
} from '../../redux/features/listenerManager/slice'
import { cutoffTime } from 'src/const'
import ConceptGraphListener from '../../helpers/listeners-ndk-react/ConceptGraphListener'

const ConceptGraphDashboard = () => {
  const dispatch = useDispatch()

  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const aWordTypes = oConceptGraph.byWordType.wordType
  const aRelationshipTypes = oConceptGraph.byWordType.relationshipType

  // * manage listener
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod != 'off') {
    const filter = {
      kinds: [9902, 39902],
      since: cutoffTime,
      '#P': ['tapestry'],
    }
    dispatch(updateApp('conceptGraph'))
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
    dispatch(updateListenerApplication('conceptGraph'))
  }
  return (
    <>
      <ConceptGraphListener />
      <center>
        <h3>Concept Graph Dashboard</h3>
      </center>
      <div>number of words: {Object.keys(oConceptGraph.words).length}</div>
      <div>{aWordTypes.length} aWordTypes</div>
      <div>{aRelationshipTypes.length} aRelationshipTypes</div>
    </>
  )
}

export default ConceptGraphDashboard
