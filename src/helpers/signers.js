import { useSelector } from "react-redux"

export async function signEventPGA(oEvent) {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const signInMethod = useSelector((state) => state.profile.signInMethod)
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
