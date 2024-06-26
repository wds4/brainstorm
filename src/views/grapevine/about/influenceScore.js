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
              <center>
                <h4>Influence Score Calculation</h4>
              </center>
              <p>
                At its heart, the Influence Score is a <i>weighted average</i>, with weight
                determined primarily by the Influence Score of the source. See this{' '}
                <a
                  target="_blank"
                  href="https://habla.news/a/naddr1qqxnzdes8q6rwv3hxs6rjvpeqgs98k45ww24g26dl8yatvefx3qrkaglp2yzu6dm3hv2vcxl822lqtgrqsqqqa28kn8wur"
                  rel="noreferrer"
                >
                  habla blog post
                </a>{' '}
                for more details.
              </p>
              <p>
                To see in detail how individual Influence Scores are calculated, open the Influence
                Scores tab of any profile.
              </p>
            </div>

            <div>
              <center>
                <h4>Influence Score Advantages</h4>
              </center>
              <div>
                Compared to the WoT Score, the Influence Score has the following advantages:
              </div>
              <div>
                <li>
                  The Influence Score can see beyond 2 hops away from you on your social graph. This
                  is in contrast to the WoT score (as usually implemented) which does not see past 2
                  hops.
                </li>
                <li>
                  The Influence Score can synthesize data from multiple sources at the same time and
                  is therefore ideally suited to incorporate explicit contextual attestations, a la
                  the proposed{' '}
                  <a
                    target="_blank"
                    href="https://github.com/lez/nips/blob/master/77.md"
                    rel="noreferrer"
                  >
                    NIP-77
                  </a>
                  , once such data becomes available.
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
                The Influence Score is proportional to how much attention your Grapevine
                recommendeds for you to pay to a given profile in a given context. Currently
                implemented is the baseline Influence Score, applicable to all contexts.
              </div>
              <div>
                <li>
                  A score of 1 is probably a regular person or profile, worthy of your attention, no
                  more and no less than any other profile. By definition, <i>your</i> baseline
                  Influence Score is always set to 1.
                </li>
                <li>
                  A score of 0 means that your Grapevine recommends for you to ignore this profile,
                  whether because it is probably a bot or spam (communicated via mutes) or it has
                  simply not been evidenced to be a normal profile (because it is not connected to
                  you via follows).
                </li>
              </div>
            </div>
            <div>
              <center>
                <h4>Coming soon: CONTEXTUAL INFLUENCE SCORES</h4>
              </center>
              <div>
                The next major BrainSToRm update will enable users to publish context-specific
                attestations for noteworthy content creators deemed worthy of above-average
                attention in some category or context of interest. These attestations will be
                incorporated into contextual Influence Scores and will be weighted more heavily than
                follows and mutes. Contextual Influence Scores higher than unity will indicate
                profiles worthy of your special attention in that context. In this way,{' '}
                <i>contextual content discovery</i> becomes possible, even when the desired profile
                has few or no followers and/or is disconnected from you on the social (follows)
                graph.
              </div>
            </div>
          </div>
        </CRow>
        <hr />
        <CRow>
          <center>
            <h4>CALCULATION OF THE INFLUENCE SCORE: A DETAILED DESCRIPTION</h4>
          </center>
          <p>
            If you are a developer and you are considering writing your own implementation of the
            Influence Score, here is an attempt to tell you everything you will need to know.
          </p>
          <p>Most of the code can be found here:</p>
          <pre>
            https://github.com/wds4/brainstorm/blob/main/src/views/grapevine/scoreCalculations/contextualInfluenceScores/contextualInfluenceCalculations.js
          </pre>
          <p>
            There is one very important function, convertInputToCertainty, that is called by the
            above file, located at
            https://github.com/wds4/brainstorm/blob/main/src/helpers/grapevine/index.js, which
            should not be overlooked.
          </p>
          <h3>what's being calculated</h3>
          <p>
            At the time of this writing, this website calculates the generic Influence Score (gIS)
            as well as contextual Influence Scores (cIS).
          </p>
          <h4>generic Influence Score, gIS</h4>
          <p>
            If we're being pedantic, the gIS should be technically considered a contextual Influence
            Score where the context is "the superset of all contexts." Although: it might be more
            appropriate to say that the context of the gIS is not actually all contexts, but rather:
            "trust to curate my content on nostr, in all categories, the said trust of which
            includes the identificaiton of other npubs who are trusted to do the same." In other
            words, the context of the gIS is: trust to curate content on nostr, in all categories,
            and treat it like it's transitive. But that would make for a long name, so for now, in
            the code, the gIS referred to as simply the Influence Score; or in this document as the
            generic Influence Score, gIS.
          </p>
          <h4>contextual Influence Scores, cIS</h4>
          <p>
            A contextual Influence Score should be interpreted as referring to: "trust to curate my
            content on nostr" (like the gIS), in the specified Category. For now, the Categories in
            question are expected to be any human-readable string. In practice, most currently
            utilized Categories are Wiki Categories. However, anyone can create a new context, in
            the form of a (preferably human-readable) string, by issuing a Contextual Endorsement at
            the profile page of any user and typing in a new Category in the field provided.
          </p>
          <h3>raw data</h3>
          <p>
            The gIS are calculated using follows and mutes as raw data. Think of each follow and
            each mute as its own individual "vote."
          </p>
          <p>
            The cIS are calculated using two sources:
            <li>likes, dislikes, or emoji reactions to individual wiki articles.</li>
            <li>
              Contextual Endorsements, issued from this website on the user profile page. You can
              see what the nostr event looks like by clicking the raw JSON button.
            </li>
          </p>
          <p>
            Each like, dislike, emoji reaction, andcontextual endorsement is its own individual
            "vote."
          </p>
          <h3>Interpretation</h3>
          <p>
            Interpretation is central to the Grapevine and to calculation of the Influence Score.
            Interpretation means that you take some piece of raw data, such as a like or a follow or
            a zap or a contextual endorsement or whatver, and you translate it into three fields:
            <li>a context field</li>
            <li>a score field, which is a number</li>
            <li>a confidence field, which is a number between 0 and 100 percent</li>
          </p>
          <p>
            These three fields are the heart and soul of the proposed NIP-77. Interpretation means
            that we act AS IF the author of the piece of data had, in fact, issued a trust
            attestation in NIP-77 format, with all three of those fields specified. Of course, that
            is not what actually happens. So we just have to make our best-faith guess as to what
            the raw data actually signifies.
          </p>
          <p>
            One might get distracted here by a philosophical aside: what is the "correct" way to
            interpret the raw data in question? I propose to consider that we should be asking
            ourselves, rather, what is the most USEFUL interpretation of the raw data. Arguably, the
            most useful interpretation is going to be our best-faith effort at guessing state of
            mind of the issuer of the piece of data. The state of mind of the issuer is something
            that exists, in objective reality, so we are doing our best to model this small piece of
            objective reality.
          </p>
          <p>
            Of course, in the real world, there are instances where people engage in what might be
            considered the intentional, willful MISinterpretation of something that someone else
            says or does. That is an interesting discussion, but one to be saved for later. For now,
            the presumption is that when calculating Influence Scores via the method of the
            Grapevine, the INTERPRETATION of raw data should always be given a best-faith effort at
            reflecting objective reality, referring here to the state of mind of other entities who
            have an objective existence in this world, and the motivation is that doing so will turn
            out to have maximum utility to the one doing the interpretation.
          </p>
          <h4>follows and mutes</h4>
          <li>context: to curate nostr content, in all categories.</li>
          <li>score = 100 (follow) or 0 (mute)</li>
          <li>
            confidence: 5% (follow) or 10% (mute). These values can be adjusted by the user in
            Grapevine Settings. Most users will have no interest in looking under the hood until the
            Grapevine method has gained wider usage. The reason for such a low value is that, as we
            all know, just because you follow somoeone doesn't necessarily nean you trust that
            person.
          </li>
          <p>
            At some point in the code, the score gets normalized by dividing by 100, so a follow
            actually interpreted as a "vote" for a score of 1, and a mute as a "vote" for a score of
            0. A "vote" of one should be interpreted as the statement: I think the value of this
            user, in this context, is roughly equal to the value of the reference user, which is ME,
            the logged-in npub. In other words, this user is worth your ATTENTION. A "vote" of zero
            means: this user is worth nothing to me; has earned NONE of my attention. Effectively,
            the function of the gIS is to sort the world into npubs that are probably Real Users
            versus those that are probably Bots and Scammers. It is a very crude sorting, but useful
            nevertheless.
          </p>
          <h4>likes, dislikes, and emoji reactions to a wiki article: </h4>
          <li>
            Context equals the category of the article, if one is provided. If none is provided, the
            reaction is ignored.
          </li>
          <li>
            Score: for a "Good Reaction" (see the array of emojis aGoodReactions in const folder),
            score = 200 (unnormalized), or 2 (normalized); for a "bad reaction" (minus or thumb
            down), score = 0.
          </li>
          <li>Confidence: 20 percent</li>
          <h4>Contextual Attestations</h4>
          <li>Context: as specified in the attestation</li>
          <li>
            score:👎 = 0; 👍 = 200 (unnormalized), 2 (normalized); 🔥 = 500 (not normalized), 5
            (normalized); in other words, 🔥 indicates a statement that this user deserves to be
            weighted FIVE TIMES as much as the reference user, i.e. 5 times as much as a randomly
            chosen non-bot npub. (The meaning of the "reference user" is another topic that could
            lead to a long philosophical discussion. One might argue the "reference user" must
            always be the logged-in npub. But we must be careful not to be derailed by such
            discussions. Our goal here is simply to build something useful.
          </li>
          <li>Confidence: 35 percent. I figure </li>
          <h3>Calculation</h3>
          <p>
            This applies to gIS and to cIS. Initilize the Influence Score for all known npubs. There
            are four components to the Influence Score: averageScore, confidence, input, and
            influence. At initialization, for every npub, averageScore = 0, confidence = 0, input =
            0, and influence = 0. The only exception is the anchor user, which is always YOU, i.e.
            the logged-in npub, for which the influence score components are FIXED: influence = 1,
            confidence = 100 percent, input = 999 (in theory, it takes infinite input to produce a
            confidence of 100 percent). Note that the influence component must ALWAYS equal the
            averageScore times the confidence, and the confidence is ALWAYS a function of input, as
            discussed below.
          </p>
          <p>
            We next ITERATE through each npub, one at a time, and we recalculate the averageScore as
            a WEIGHTED AVERAGE, using all available data. For gIS, all available data means all
            follows and mutes of that npub. The score is as indicated above in the discussion on
            Interpretation. The WEIGHT is a product of three numbers: the confidence (5 percent for
            follows, 10 percent for mutes); the INFLUENCE (=averageScore * confidence) component of
            the issuer of the follow, mute, or other piece of data; and the attenuation factor, AF.
            There is one exception: if the issuer of the data is the logged-in npub, the AF is
            omitted from the weight. The AF is a number between 0 and 1. The default is 0.8, and it
            can be adjusted by the user in the Grapevine Control Panel. The purpose of the AF is to
            lessen the final influence of users who are many hops away from you. If the AF is set to
            zero, then the Influence Score ends up giving everyone in your follows list a score of 1
            and everyone else a score of zero. So the AF can be thought of as an expression of
            whether or not you think that follows and mutes should be "transitive" -- a discussion
            that often comes up in nostr. With the AF, you can make is somewhere in between.
          </p>
          <p>
            With each iteration, once the averageScore is calculated, the next step is to calculate
            the INPUT component, which equals the sum of each of the weights of each of the votes
            used to calculate the averageScore.
          </p>
          <p>
            Next, we calculate the confidence. This is a function of input. The salient features of
            this calculation is that we are mapping a number in the range of 0 to infinity onto a
            number in the range of 0 to 1 (i.e. 100 percent). The curve should approach 1 as an
            exponent. See{' '}
            <a href="https://habla.news/a/naddr1qqxnzdes8q6rwv3hxs6rjvpeqgs98k45ww24g26dl8yatvefx3qrkaglp2yzu6dm3hv2vcxl822lqtgrqsqqqa28kn8wur">
              this article
            </a>{' '}
            for a discssion of the rationale behind this equation. Note that this equation requires
            an arbitrary constant, called "rigor", which can be adjusted in the Control Panel.
            Basically, rigor controls how quickly or how slowly the curve approaches 100 percent. I
            set the default rigor at 60, and I picked that by playing with it (and some of the other
            parameters) and looking at the results I got on the Trending, Popular, and Controversy
            ratings of wiki topics. Once again, I picked them based on the principle of maximizing
            the utility of these calculations.
          </p>
          <p>
            btw: the default values for each of these constants can be found at
            https://github.com/wds4/brainstorm/blob/main/src/const.js
          </p>
          <p>
            Once confidence is calculated, we can calculate Influence Score as the produce of
            confidence and averageScore. The rationale is that how much attention I want to give to
            any given npub should be a function of averageScore and also a function of confidence,
            and multiplying them together is a reasonable enough way to go about it. It's certainly
            better than averageScore multiplied by INPUT, which would reward people for being
            Influencoors, which is what we wish to avoid.
          </p>
          <p>Do all the above for each npub.</p>
          <p>
            Keep iterating through every npub until all values converge, i.e. until one full
            iteration produces no changes in value. To be honest, now that I look back, right now
            I'm just doing 8 full iterations. When I get time I'll go back and set that to iterate
            until convergence, with a cap on number of iterations in case of some bug like maybe
            bouncing back and forth between two values forever.
          </p>
          <p>That's it!</p>
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutInfluenceScore
