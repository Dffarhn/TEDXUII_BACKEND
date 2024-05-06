const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const client = createClient({
  url: process.env.URL_REDIS,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

module.exports = { client };
