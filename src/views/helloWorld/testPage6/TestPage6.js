import React from 'react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../helpers'

const TestPage = () => {
  const oWikiArticles_byNaddr = useSelector((state) => state.nostrapedia.articles.byNaddr)
  const aNaddr = Object.keys(oWikiArticles_byNaddr)
  const aClients = []
  const oNumberEachClient = {}
  aNaddr.forEach((naddr, item) => {
    const oEvent = oWikiArticles_byNaddr[naddr]
    const client = fetchFirstByTag('client', oEvent)
    if (client) {
      if (!aClients.includes(client)) {
        aClients.push(client)
        oNumberEachClient[client] = 0
      }
      oNumberEachClient[client]++
    }
  })
  return (
    <>
      <center>
        <h3>Test Page 6</h3>
      </center>
      <div>total number of articles: {aNaddr.length}</div>
      <div>number of articles per client of origin:</div>
      <div>
        {aClients.map((client) => {
          return (
            <>
              <div>
                {oNumberEachClient[client]} {client}
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default TestPage
