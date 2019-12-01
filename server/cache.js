/**
 * Cache saves objects in memory for a duration of time
 */
function Cache() {

    let cache = {}; // Default value

    /**
     * Get an object from the cache based on a key
     * @param key The name of the cached object
     * @returns {null|Object} Returns null if object doesn't exist or has expired, otherwise returns the requested object
     */
    this.get = (key) => {
        if (!cache.hasOwnProperty(key)) { // Key doesn't exist
            return null;
        }

        let data = cache[key];

        if (data.expiresAt < new Date()) { // Expired
            cache[key] = undefined; // Remove from cache
            return null;
        } else {
            return data.object;
        }
    };

    /**
     * Insert an object into the cache with a key
     * @param key The key to retrieve the object
     * @param value The object
     * @param expiresIn The amount of time, in seconds, until the object is invalid
     */
    this.put = (key, value, expiresIn) => {
        let expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

        cache[key] = {
            object: value,
            expiresAt: expiresAt
        };
    };

}

module.exports = Cache;