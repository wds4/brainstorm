import React from 'react'
import { useSelector } from 'react-redux'

const ConceptGraphDashboard = () => {
  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const aWordTypes = oConceptGraph.byWordType.wordType
  const aRelationshipTypes = oConceptGraph.byWordType.relationshipType
  return (
    <>
      <center>
        <h3>Concept Graph Dashboard</h3>
      </center>
      <div>{aWordTypes.length} aWordTypes</div>
      <div>{aRelationshipTypes.length} aRelationshipTypes</div>
    </>
  )
}

export default ConceptGraphDashboard
