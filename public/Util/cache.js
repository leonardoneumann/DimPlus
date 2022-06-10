/** @module Util */

const CACHE_VERSION = 1;
const CACHE_KEY_PREFIX = 'dimplus'
const CACHE_ROOT = `${CACHE_KEY_PREFIX}-${CACHE_VERSION}`
const CACHE_DEFAULT_LIFE = 24 * 60 // 24 hours

class CacheManager {
    
    /**
     * Tries to fetch request response from cache, if not fetchs it live and adds it
     * @param {RequestInfo} requestInfo RequestInfo object
     * @returns {Promise<T>} Request response.
     */
    static async fetch(requestInfo) {
        
        let cachedData = await this.#getCachedRequest(requestInfo);
    
        if (cachedData) {
            return cachedData;
        }
    
        const cacheStorage = await caches.open(CACHE_ROOT);
        
        await cacheStorage.add(requestInfo);

        cachedData = await this.#getCachedRequest(requestInfo);
    
        return cachedData;
    }

    /**
     *
     *
     * @static
     * @param {String} key
     * @param {Function} fetchFn 
     * @param {*} [cacheLife=CACHE_DEFAULT_LIFE]
     * @return {*} 
     * @memberof CacheManager
     */
    static async fetchAny(key, fetchFn, cacheLife = CACHE_DEFAULT_LIFE) {
        let cachedData = await CacheManager.readDataFromCache(key)

        if(cachedData) {
            return cachedData
        } else {
            let newData = await fetchFn()

            if(newData) {
                CacheManager.saveDataToCache(key, newData, cacheLife)
                return newData
            } else {
                return null
            }
        }
    }

    /**
     * Reads request response from cache
     * @param {RequestInfo} requestInfo RequestInfo object or key name
     * @param {string} cacheKeyRoot Cache name
     * @returns {Object} Cached Data or false
     */
    static async #getCachedRequest(requestInfo, cacheKeyRoot = CACHE_ROOT) {
        const cacheStorage = await caches.open(cacheKeyRoot)
        const cachedResponse = await cacheStorage.match(requestInfo)

        if ( !cachedResponse || !cachedResponse.ok ) {
            return false
        }

        let resp = await cachedResponse.json()

        if(resp.cacheLife) {
            if(this.checkCacheLife(resp)) {
                return resp.cacheData
            } else {
                await cacheStorage.delete(requestInfo)
                return false
            }
        } else {
            return resp
        }
    }

    /**
     *
     *
     * @static
     * @param {Object} cache cache object
     * @return {*} 
     * @memberof CacheManager
     */
    static checkCacheLife(cache) {
        if (cache.cacheCreation && cache.cacheLife && cache.cacheData) {
            let createTime = new Date(cache.cacheCreation).getTime()
            let cacheLife = Date.now() - createTime

            if (cacheLife > (1000 * 60 * cache.cacheLife)) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    /**
     * reads generic data from the Cache Storage as JSON
     * @param {string} key cache key name
     * @returns {Promise<T>} Request response.
     */
    static async readDataFromCache(key) {
        let cachedData = await this.#getCachedRequest(key);
    
        if (cachedData) {
            return cachedData;
        }

        return null;
    }

    /**
     * Writes generic data object from the Cache Storage as JSON
     * @param {string} key cache key name
     * @param {Object} data generic data
     * @param {Object} life minutes for cache to expire, 24 hours as default
     * @returns {Promise<T>} Request response.
     */
    static async saveDataToCache(key, data, life = CACHE_DEFAULT_LIFE) {
        let cacheObject = { cacheCreation: Date.now(), cacheLife: life, cacheData: data }
        let resp = new Response(JSON.stringify(cacheObject))
        const cacheStorage = await caches.open(CACHE_ROOT)
        
        await cacheStorage.put(key, resp)
    }

    /**
     * Delete any old caches to respect user's disk space.
     *
     * @static
     * @memberof CacheManager
     */
    static async pruneOldVersions() {
        const keys = await caches.keys();
    
        for (const key of keys) {
            const isOurCache = CACHE_KEY_PREFIX === key.substring(0, 6);
        
            if (CACHE_ROOT === key || ! isOurCache) {
                continue;
            }
        
            caches.delete(key);
        }
    }

    static async pruneExpiredRecords() {
        // should do the same as pruneOldVersions but checking the cache life
    }
 
}