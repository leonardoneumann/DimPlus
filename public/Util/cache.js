/** @module Util */

const cacheVersion = 1;
const cacheNamePrefix = 'dimplus'
const cacheName = `${cacheNamePrefix}-${cacheVersion}`

class CacheManager {
    // Try to get data from the cache, but fall back to fetching it live.
    async getRequestData(requestInfo) {
        
        let cachedData = await this.getCachedData( cacheName, requestInfo );
    
        if ( cachedData ) {
            console.log( 'Retrieved cached data' );
            return cachedData;
        }
    
        console.log( 'Fetching fresh data' );
    
        const cacheStorage = await caches.open( cacheName );
        
        await cacheStorage.add( requestInfo );

        cachedData = await this.getCachedData( cacheName, requestInfo );
    
        return cachedData;
    }

    // Try to get data from the cache, but fall back to fetching it live.
    async getKeyData(key) {

        let cachedData = await this.getCachedData( cacheName, key );
    
        if ( cachedData ) {
            console.log( 'Retrieved cached data' );
            return cachedData;
        }

        return null;
    }

    // Try to get data from the cache, but fall back to fetching it live.
    async setKeyData(key, data) {

        let resp = new Response(JSON.stringify(data))
        const cacheStorage = await caches.open( cacheName );
        
        await cacheStorage.put(key, resp)
    }
    
    // Get data from the cache.
    async getCachedData( cacheName, requestInfo ) {
        const cacheStorage   = await caches.open( cacheName );
        const cachedResponse = await cacheStorage.match( requestInfo );
    
        if ( ! cachedResponse || ! cachedResponse.ok ) {
        return false;
        }
    
        return await cachedResponse.json();
    }
    
    // Delete any old caches to respect user's disk space.
    async deleteOldCaches( currentCache ) {
        const keys = await caches.keys();
    
        for ( const key of keys ) {
        const isOurCache = cacheNamePrefix === key.substr( 0, 6 );
    
        if ( currentCache === key || ! isOurCache ) {
            continue;
        }
    
        caches.delete( key );
        }
    }
 
}