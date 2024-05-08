import React from 'react'
import { useSelector } from 'react-redux'
import ConceptGraphListener from 'src/helpers/listeners/ConceptGraphListener'

const ConceptGraphDashboard = () => {
  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const aWordTypes = oConceptGraph.byWordType.wordType
  const aRelationshipTypes = oConceptGraph.byWordType.relationshipType
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
