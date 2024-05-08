import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DataGrid from 'react-data-grid'

import 'react-data-grid/lib/styles.css'
import ConceptGraphListener from '../../../../helpers/listeners/ConceptGraphListener'

const defaultColumnProperties = {
  sortable: true,
  filterable: true,
}

const ViewAllWords = () => {
  const oConceptGraph = useSelector((state) => state.conceptGraph)

  const [rows, setRows] = useState([])

  const columns = [
    { key: 'id', name: 'ID', sortDescendingFirst: false },
    { key: 'wt', name: 'Word Type', sortDescendingFirst: true },
    { key: 'cid', name: 'Cid' },
    { key: 'pk', name: 'Pubkey' },
  ].map((c) => ({ ...c, ...defaultColumnProperties }))

  useEffect(() => {
    const aRows = []
    Object.keys(oConceptGraph.words).forEach((cid) => {
      const event = oConceptGraph.words[cid]
      const pk = event.pubkey
      const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
      let wT = ''
      if (aTags_w.length > 0) {
        wT = aTags_w[0][1]
      }
      const nextRow = { id: aRows.length, wt: wT, cid: cid, pk: pk }
      aRows.push(nextRow)
      setRows(aRows)
    })
  }, [oConceptGraph])

  return (
    <>
      <ConceptGraphListener />
      <center>
        <h3>View All Words</h3>
      </center>
      <div>number of words: {Object.keys(oConceptGraph.words).length}</div>
      <DataGrid columns={columns} rows={rows} />
    </>
  )
}

export default ViewAllWords
