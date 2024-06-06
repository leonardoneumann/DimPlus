const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'

export const LIGHTGG_COMMUNITYAVG_SELECTOR = '#community-average'
//const LIGHTGG_MYROLLS_ELEMID = 'my-rolls'
//const LIGHTGG_SOCKETS_ELEMID = 'socket-container'

export const LightGGItemUrl = (itemHash: number) => `${LIGHTGG_ITEMDB_URL}${itemHash}${LIGHTGG_COMMUNITYAVG_SELECTOR}`
