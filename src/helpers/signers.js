import { finalizeEvent } from 'nostr-tools' // for up to date nostr tools
// import { getEventHash, getSignature } from 'nostr-tools' // for nostr-tools 1.14.0

export async function signEventPGA(oProfile, oEvent) {
  const signedIn = oProfile.signedIn
  const signInMethod = oProfile.signInMethod
  const hexKey = oProfile.hexKey

  if (!signedIn) {
    return false
  }
  if (signInMethod == 'extension') {
    const oEvent_signed = await window.nostr.signEvent(oEvent)
    return oEvent_signed
  }
  if (signInMethod == 'secret') {
    const oEvent_signed = finalizeEvent(oEvent, hexKey)
    return oEvent_signed
    // oEvent.pubkey = oProfile.pubkey
    // oEvent.id = getEventHash(oEvent)
    // oEvent.sig = getSignature(oEvent)
    // return oEvent
  }
  return false
}
