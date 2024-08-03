import { cibGit, cibGithub } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CContainer, CNavLink } from '@coreui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import ContentDiscoveryListener from '../../../helpers/listeners-ndk-react/ContentDiscoveryListener'

const ContentDiscoveryAbout = () => {
  const dispatch = useDispatch()
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <>
      <CContainer>
        <center>
          <h3>About Content Discovery</h3>
        </center>
        <ContentDiscoveryListener />
        <br />
        <br />
        <div>
          Content Discovery is the app that enables your Grapevine to make recommendations of
          profiles to follow for any given context. These recommendations come in the form of{' '}
          <i>Contextual Recommendation Lists</i>.
        </div>
        <br />
        <div>
          <i>Contextual Recommendation Lists</i> are determined by the{' '}
          <i>Contextual Influence Score</i>. A score of 1 should be interpreted as "average" in
          terms of how much attention your Grapevine recommends you to give to the given profile in
          the given context. Any profile with a score higher than the desired cutoff is placed on
          the list. Calculation of the Score is based on two sources:
          <li>
            Likes and dislikes of wiki articles, with the context set equal to the category of the
            article. For any given context, each like is <i>interpreted</i> as a vote for a score of
            2, and each dislike as a vote for a score of 0.
          </li>
          <li>
            Contextual Endorsements: 👍 (Follow / Endorse), 🔥 (SuperFollow / SuperEndorse), or 👎
            (Block / Mute). For any given context, each 👎 is <i>interpreted</i> as a vote for a
            score of 0; each 👍 as a vote for a score of 2; and each 🔥 as a vote for a score of 5.
          </li>
        </div>
        <br />
        <div>Likes and dislikes of wiki articles can be issued here or at Wikifreedia.</div>
        <br />
        <div>
          To leave a Contextual Endorsement, click on the Contextual Endorsement tab on a user's
          profile page.
        </div>
        <br />
        <div>
          From these votes, a weighted average is calculated. How much weight any given user has on
          the lists you see below is determined by the <i>generic Influence Score</i> of that user.
          In the future, you will have the option, for any given list, to replace the generic
          Influence Score to a contextual Influence Score of your choosing.
        </div>
        <br />
        <div>
          COMING SOON:
          <li>export these lists as NIP-51-formatted notes for use on other clients!</li>
          <li>ability to adjust the constants used in the interpretations noted above.</li>
          <li>
            incorporation of additional sources of data for calculation of Contextual Influence
            Scores
          </li>
        </div>
      </CContainer>
    </>
  )
}

export default ContentDiscoveryAbout
