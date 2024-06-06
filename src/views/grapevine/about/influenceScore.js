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
          <div className="d-grid gap-4 col-12 mx-auto">
            <div>
              Like the WoT Score, the Influence Score is calculated using follows and mutes data and
              does a good job of filtering out bots and spam.
            </div>

            <div>
              <div>
                Compared to the WoT Score, the Influence Score has the following advantages:
              </div>
              <div>
                <li>
                  Unlike the WoT Score, the Influence Score can see beyond 2 hops away from you on
                  your social graph.
                </li>
                <li>
                  The Influence Score asymptotically levels out at 1.000 as follower count rises. It
                  is therefore less of a popularity contest than the WoT Score.
                </li>
                <li>The Influence Score can synthesize data from multiple sources.</li>
              </div>
            </div>
            <div>
              <center>
                <h4>Influence Score interpretation:</h4>
              </center>
              <div>
                The Influence Score is proportional to how much attention it is recommended for you
                to pay to a given profile in a given context.
              </div>
              <div>
                <li>
                  A score of 1 is probably a regular person, worthy of your attention, no more and
                  no less than any other person.
                </li>
                <li>
                  A score of 0 means that the recommendation is to ignore this profile, because it
                  has either been shown to be a bot or spam, or has not been demonstrated to be
                  worthy of your attention.
                </li>
                <li>COMING SOON: A score greater than 1 is deemed worthy of special attention.</li>
              </div>
            </div>
            <div>
              To see in detail how Influence Scores are calculated, open the Influence Scores tab of
              any profile.
            </div>
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutInfluenceScore
