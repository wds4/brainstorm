import { CContainer, CRow } from '@coreui/react'
import React from 'react'

const AboutInfluenceScore = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>The Influence Score</h3>
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
                  The Influence Score can see beyond 2 hops away from you on your social graph. This
                  is in contrast to the WoT score which cannot see past 2 hops.
                </li>
                <li>
                  The Influence Score can synthesize data from multiple sources at the same time and
                  is therefore ideally suited to incorporate explicit contextual attestations once
                  such data becomes available.
                </li>
                <li>
                  No matter how high a profile's follower count gets, the baseline Influence Score
                  asymptotically levels out at 1. It is therefore less of a popularity contest than
                  the WoT Score. See this{' '}
                  <a
                    target="_blank"
                    href="https://habla.news/a/naddr1qqxnzdes8q6rwv3hxs6rjvpeqgs98k45ww24g26dl8yatvefx3qrkaglp2yzu6dm3hv2vcxl822lqtgrqsqqqa28kn8wur"
                    rel="noreferrer"
                  >
                    habla blog post
                  </a>{' '}
                  for an in-depth discussion of this issue.
                </li>
              </div>
            </div>
            <div>
              <center>
                <h4>Influence Score interpretation</h4>
              </center>
              <div>
                The Influence Score is proportional to how much attention it is recommended for you
                to pay to a given profile in a given context. Currently implemented is the baseline
                Influence Score, applicable to all contexts.
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
              </div>
            </div>
            <div>
              To see in detail how Influence Scores are calculated, open the Influence Scores tab of
              any profile.
            </div>
            <div>
              <center>
                <h4>Coming soon: CONTEXTUAL INFLUENCE SCORES</h4>
              </center>
              <div>
                The next update will enable users to create context-specific attestations for
                noteworthy content creators deemed worthy of above-average attention. These
                attestations will be incorporated into contextual Influence Scores. Contextaul
                scores higher than unity will indicate profiles worthy of your special attention.
              </div>
            </div>
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutInfluenceScore
