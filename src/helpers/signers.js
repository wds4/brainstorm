export async function signEventPGA(oProfile, oEvent) {
  const signedIn = oProfile.signedIn
  const signInMethod = oProfile.signInMethod
  if (!signedIn) {
    return false
  }
  if (signInMethod == 'extension') {
    const oEvent_signed = await window.nostr.signEvent(oEvent)
    return oEvent_signed
  }
  if (signInMethod == 'secret') {
    // not yet complete
    return false
  }
  return false
}
