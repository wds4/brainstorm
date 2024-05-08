import React from 'react'
import { useSelector } from 'react-redux'

const ViewAllWordTypes = () => {
  const oConceptGraph = useSelector((state) => state.conceptGraph)
  const aWordTypes = oConceptGraph.byWordType.wordType
  return (
    <>
      <center>
        <h3>View All Word Types</h3>
      </center>
      <div>{aWordTypes.length} aWordTypes</div>
    </>
  )
}

export default ViewAllWordTypes
