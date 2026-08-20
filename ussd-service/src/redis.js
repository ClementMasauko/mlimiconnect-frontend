// src/redis.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection on startup (optional but helpful)
redis.ping()
  .then(() => console.log('✅ Upstash Redis connected successfully'))
  .catch(err => console.error('❌ Upstash Redis connection failed:', err));

module.exports = redis;