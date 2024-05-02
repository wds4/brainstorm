import { finalizeEvent, getEventHash, getPublicKey } from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

export async function signEventPGA(oProfile, oEvent) {
  const signedIn = oProfile.signedIn
  const signInMethod = oProfile.signInMethod
  const nsec = oProfile.nsec
  const hexKey = oProfile.hexKey
  console.log('signEventPGA; signInMethod: ' + signInMethod)

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
  }
  return false
}
