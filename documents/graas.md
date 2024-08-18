# <p align="center">GRAAS: Grapevine Relay as a Service</p>

# Product overview:

A fast, cheap, easy to use service that calculates the three main Grapevine WoT Scores as currently implemented by [the Grapevine](https://brainstorm.ninja/#/grapevine) and exports them as NIP-51 lists for use by Coracle, Amethyst, and an ever-growing list of nostr clients. 

# Description: 

Centrally hosted relay with one page landing page. Calculations of the various scores are handled server-side, as opposed to at [brainstorm.ninja](brainstorm.ninja) where calculations are client-side, resulting in greater friction and a bad user experience.

Relay will keep track of kind 0, 3, and 10000 notes, along the lines of purplepag.es

## Free Tier

User logs in via standard nostr login methods

The Service (front end or back end? not sure which will make more sense) will determine whether the logged-in user's Grapevine has been (mostly, reasonably) downloaded at least 3 degrees of separation ("hops") away (ideally more than that). This will require the following (suggested) requirements to have been met:
- The logged in user's kind 3 note, producing the Hop 1 set of npubs
- Kind 3 notes of at least 50% of Hop 1 npubs, producing (hopefully) a nonempty Hop 2 set
- Kind 3 notes of at least 50% of Hop 2 npubs, producing (hopefully) a nonempty Hop 3 set

For most users the above requirements will likely have already been met, unless the logged in user is outside the standard nostr network, e.g. a user from China, Japan, etc). If not, the Service will attempt to download notes to meet the above requirements. 

The logged in user will see displayed:
- how many users are in each Hop set according to the current dataaset
- an indicator whether the Service is ready to proceed with list generation.

### List generation:

Two categories of NIP-51 lists (kind 30000) will be offered:
- "The Grapevine WoT List". This will be the top N pubkeys by Grapevine WoT Score (= Influence Score according to the current implementation at brainstorm.ninja)
- "Follow Recommendations, suggested by Your Grapevine" (or some such suitable title). Same as above, but first subtract pubkeys from the user's current follows list.

The user will select the above list type and will supply the desired N, with defaults options will be the Follow Recommendations list, N = 100 (or some other reasonable value).

These lists will export, for each pubkey, 3 scores: the [influence score](https://brainstorm.ninja/#/grapevine/influenceScore), the [legacy WoT score](https://brainstorm.ninja/#/grapevine/wotScore), and the [DoS score](https://brainstorm.ninja/#/grapevine/dosScore), as follows:
`[ 'p', pubkey, '', influenceScore, woTscore, doSscore]`

The user will have the option to view the NIP-51 list in raw format if desired. Once it's ready, the Service will prompt the user to sign and publish the note.

Once published, the user will be promted to do one of the following:
- view the list at listr.lol
- use the list at Coracle.social, Amethyst, and whatever other clients allow NIP-51 list importation.

Optional: include instructions on how to use the list. (I tried to use mine at Coracle and had trouble figuring out how.)

## Pair Tier

The user will be given an option to sign up for a service, paying on chain or lightning, with payment UX similar to current implementation at relay.tools. This service will generate up to some reasonable number (5 or 6?) of Lists that will be updated periodically, perhaps once every 24 hours. These notes will be signed at the back end by an npub corresponding to the Service.

# Tech stack

front end: react, typescript, NDK

back end: open to suggestion

Pretty Good Freedom Tech will provide a github account and pay to host the domain at a suitable url (dev.grapevine.social?) while under development at vercel, digital ocean, or some other reasonable hosting service. Any dev working on the bounty will be given the ability to merge pull requests which will automatically deploy changes. Final version will be released under aGPL-3.0.

# Bounty 

offered by Pretty Good Freedom Tech

## Milestone 1: Implement the free tier.

Amount ?
Expected time to complete: ?

Bounty is triggered once 10 normal users (npubs with Grapevine WoT Score above some reasonable cutoff, like 0.5) have exported at least one NIP-51 list. Bounty triggers in a pro-rated fashion (first user triggers one-tenth of bounty, etc). Bonus up to 50% if completed by some preset time.

## Milestone 2: Implement the paid tier.

Amount ?
Expected time to complete: ?

## Future Projects (for future bounties)

A few of the potential future directions:
- Allow the user to adjust Grapevine parameters as can be done [here](https://brainstorm.ninja/#/settings/grapevine)
- contextual lists, based on contextual Grapevine Scores, as per [Content Discovery](https://brainstorm.ninja/#/contentDiscovery)
- Allow users to spin up personal Grapevine relays, similar to relay.tools

