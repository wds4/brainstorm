import { CContainer, CRow } from '@coreui/react'
import React from 'react'

const AboutWotScore = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>The Web of Trust (WoT) Score</h3>
        </center>
        <br />
        <CRow>
          <p>
            The WoT Score is more or less the state of the art for web of trust content curation on
            nostr.
          </p>
          <p>
            The number of profiles in the intersection between your follows and another profile's
            followers equals that profile's WoT Score. In many implementations, the score is reduced
            by some amount by mutes (not yet implemented here at brainStorm).
          </p>

          <p>
            The WoT does a good job of filtering out obvious spam. However, the WoT score suffers
            several disadvantages:
          </p>
          <p>
            <li>
              The WoT score rewards users for accumulating high follower counts. It is not unfair to
              call it a popularity contest.
            </li>
            <li>
              Any profile more than two hops away from you will have a WoT score of zero. The WoT
              score cannot "see" past 2 hops, and is poorly suited for content discovery.
            </li>
            <li>It is not at all clear how to use the WoT score to reflect context.</li>
          </p>
          <p>
            The purpose of the{' '}
            <div style={{ display: 'inline-block' }}>
              <a href="#/grapevine/influenceScore">Influence Score</a>
            </div>{' '}
            is to address each of the above disadvantages.
          </p>
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutWotScore
