import React from 'react'
import { useSelector } from 'react-redux'
import RawDataNostrEvent from './RawDataNostrEvent'

const TestPage5 = () => {
  const oKind7Ratings_byKind7EventId = useSelector((state) => state.nostrapedia.kind7Ratings.byKind7EventId)

  return (
    <>
      <center>
        <h3>Test Page 5</h3>
        <div>Explore kind 7 events stored in redux store</div>
      </center>
      <div>{Object.keys(oKind7Ratings_byKind7EventId).length} kind 7 events in redux store</div>
      <div>
        {Object.keys(oKind7Ratings_byKind7EventId).map((kind7EventId, item) => {
          const oEvent = oKind7Ratings_byKind7EventId[kind7EventId]
          return (
            <>
              <RawDataNostrEvent oEvent={oEvent} item={item} />
            </>
          )
        })}
      </div>
    </>
  )
}

export default TestPage5
