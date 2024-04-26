export const COMMON_CONTACT_RELAY = safeRelayUrl('wss://purplepag.es')

export function getRelayVariations(relay) {
  if (relay.endsWith('/')) {
    return [relay.slice(0, -1), relay]
  } else return [relay, relay + '/']
}

export function validateRelayURL(relay) {
  if (typeof relay === 'string' && relay.includes(',ws'))
    throw new Error('Can not have multiple relays in one string')
  const url = typeof relay === 'string' ? new URL(relay) : relay
  if (url.protocol !== 'wss:' && url.protocol !== 'ws:') throw new Error('Incorrect protocol')
  return url
}
export function isValidRelayURL(relay) {
  try {
    validateRelayURL(relay)
    return true
  } catch (e) {
    return false
  }
}

export function safeRelayUrl(relayUrl) {
  try {
    return validateRelayURL(relayUrl).toString()
  } catch (e) {
    return null
  }
}

export function safeRelayUrls(urls) {
  return Array.from(urls).map(safeRelayUrl).filter(Boolean)
}
