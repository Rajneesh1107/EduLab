require("dotenv").config("silent");
const Redis = require("ioredis");

const redis_client = new Redis({
  port: process.env.REDIS_PORT,
  host: `${process.env.REDIS_HOST}`,
  password: `${process.env.REDIS_PASSWORD}`,
});

module.exports = redis_client;
