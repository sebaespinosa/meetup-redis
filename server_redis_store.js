const express = require('express');
const axios = require('axios');
const cors = require('cors');

const Redis = require('redis');
let redisClient;

( async () => {
  redisClient = Redis.createClient();
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Redis Client Connected'));
  await redisClient.connect();
})();


const app = express();
app.use(cors());

app.get('/photos', async (req, res) => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/photos"
  );

  redisClient.SETEX("photos", 3600, JSON.stringify(data));

  res.json(data);
});

app.listen(3000);