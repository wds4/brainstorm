import { CContainer, CRow } from '@coreui/react'
import React from 'react'

const AboutInfluenceScore = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>Influence Score</h3>
        </center>
        <br />
        <CRow>
          <div>
            Like the WoT Score, the Influence Score is calculated using follows and mutes data and
            does a good job of filtering out bots and spam.
          </div>
          <br />
          <br />
          <div>Compated to the WoT Score, the Influence Score has the following advantages:</div>
          <li>
            Unlike the WoT Score, the Influence Score can see beyond 2 hops away from you on your
            social graph.
          </li>
          <li>The Influence Score is less of a popularity contest than the WoT Score.</li>
          <li>The Influence Score can synthesize data from multiple sources.</li>
          <br />
          <br />
          <div>Influence Score interpretation:</div>
          <div>
            The Influence Score is proportional to how much attention you should pay to a given
            profile in a given context.
          </div>
          <li>
            A score of 1 is probably a regular person, worthy of your attention, no more and no less
            than any other person.
          </li>
          <li>A score of 0 is probably a bot, not worthy of your attention.</li>
          <li>COMING SOON: A score greater than 1 is deemed worthy of special attention.</li>
          <br />
          <br />
          <div>
            To see in detail how Influence Scores are calculated, open the Influence Scores tab of
            any profile.
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutInfluenceScore
