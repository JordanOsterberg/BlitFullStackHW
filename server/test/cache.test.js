const assert = require("assert");

describe("Cache", function() {
    const Cache = require("../cache");

    it("should return a value when cached value has not expired", function() {
        const testCache = new Cache();
        testCache.put("test", 1, 10);
        assert(testCache.get("test") === 1);
    });

    it("should return null when a cached value has expired", function(done) {
        const testCache = new Cache();
        testCache.put("test", 1, 1);

        this.timeout(1100);

        setTimeout(() => {
            assert(testCache.get("test") === null);
            done()
        }, 1000);
    });

    it("should return null when a key does not exist in the cache", function() {
        const testCache = new Cache();
        assert(testCache.get("test") === null);
    });
});