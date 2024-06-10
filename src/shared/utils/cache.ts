const CACHE_VERSION = 1
const CACHE_KEY_PREFIX = 'dimplus'
const CACHE_ROOT = `${CACHE_KEY_PREFIX}-${CACHE_VERSION}`
const CACHE_DEFAULT_LIFE = 24 * 60 // 24 hours

export async function fetch(requestInfo: RequestInfo): Promise<Response | false> {
  const cachedData = await getCachedRequest<Response>(requestInfo)

  if (cachedData) {
    return cachedData
  }

  const cacheStorage = await caches.open(CACHE_ROOT)
  await cacheStorage.add(requestInfo)

  return getCachedRequest(requestInfo)
}

export async function fetchAny<T>(
  key: string,
  fetchFn: () => Promise<T>,
  cacheLife: number = CACHE_DEFAULT_LIFE,
): Promise<T | false> {
  const cachedData = await readDataFromCache<T>(key)

  if (cachedData) {
    return cachedData
  } else {
    const newData = await fetchFn()

    if (newData) {
      saveDataToCache(key, newData, cacheLife)
      return newData
    } else {
      return null
    }
  }
}

async function getCachedRequest<T>(requestInfo: RequestInfo, cacheKeyRoot = CACHE_ROOT): Promise<T | false> {
  const cacheStorage = await caches.open(cacheKeyRoot)
  const cachedResponse = await cacheStorage.match(requestInfo)

  if (!cachedResponse || !cachedResponse.ok) {
    return false
  }

  const resp = await cachedResponse.json()

  if (resp.cacheLife) {
    if (checkCacheLife(resp)) {
      return resp.cacheData
    } else {
      await cacheStorage.delete(requestInfo)
      return false
    }
  } else {
    return resp
  }
}

function checkCacheLife(cache: { cacheCreation?: number; cacheLife?: number; cacheData? }): boolean {
  if (cache.cacheCreation && cache.cacheLife && cache.cacheData) {
    const createTime = new Date(cache.cacheCreation).getTime()
    const cacheLife = Date.now() - createTime

    return cacheLife <= 1000 * 60 * cache.cacheLife
  } else {
    return false
  }
}

async function readDataFromCache<T>(key: string): Promise<T | false> {
  const cachedData = await getCachedRequest<T>(key)

  if (cachedData) {
    return cachedData
  }

  return null
}

export async function saveDataToCache<T>(key: string, data: T, life: number = CACHE_DEFAULT_LIFE): Promise<void> {
  const cacheObject = { cacheCreation: Date.now(), cacheLife: life, cacheData: data }
  const resp = new Response(JSON.stringify(cacheObject))
  const cacheStorage = await caches.open(CACHE_ROOT)
  await cacheStorage.put(key, resp)
}

export async function pruneOldVersions(): Promise<void> {
  const keys = await caches.keys()

  for (const key of keys) {
    const isOurCache = CACHE_KEY_PREFIX === key.substring(0, 6)

    if (CACHE_ROOT === key || !isOurCache) {
      continue
    }

    await caches.delete(key)
  }
}
