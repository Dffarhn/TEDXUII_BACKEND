const { client } = require("../../redis_connect.js");

const redisCacheMiddleware_Bundling = async (req, res, next) => {
  const cacheKey = `bundlings_${req.query.sort || "default"}`;

  let chechkredis = await client.get(cacheKey);
  if (chechkredis) {
    // client.del(cacheKey)
    res.send(JSON.parse(chechkredis));
  } else {
    console.log("miss");
    next();
  }
};
const redisCacheMiddleware_Events = async (req, res, next) => {
  const { sort, year, name } = req.query;

  // Create cache key based on query parameters
  const cacheKey = `events_${sort || "default"}_${year || "default"}_${name || "default"}`;
  let chechkredis = await client.get(cacheKey);
  if (chechkredis) {
    // client.del(cacheKey)
    res.send(JSON.parse(chechkredis));
  } else {
    console.log("miss");
    next();
  }
};
const redisCacheMiddleware_Merchandises = async (req, res, next) => {
  const { sort } = req.query;
  const cacheKey = `merchandises_${sort || "default"}`;
  let chechkredis = await client.get(cacheKey);
  if (chechkredis) {
    // client.del(cacheKey)
    res.send(JSON.parse(chechkredis));
  } else {
    console.log("miss");
    next();
  }
};

module.exports = { redisCacheMiddleware_Bundling, redisCacheMiddleware_Events, redisCacheMiddleware_Merchandises };
