const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

let redisClient

( async () => {
  redisClient = Redis.createClient();
  redisClient.on('error', (err) => console.log('Redis Client Error', err))
  redisClient.on('connect', () => console.log('Redis Client Connected'))
  await redisClient.connect()
})()

const app = express()
app.use(cors())

app.get('/photos', async (req, res) => {
  console.log("entro")
  console.log(redisClient.isOpen)
  console.log(redisClient.isReady)
  const value = await redisClient.get('photos');
  if (value != null) {
    console.log("Cache Hit")
    return res.json(JSON.parse(value))
  }
  if (value == null) {
    console.log("Cache Miss")
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos")
    redisClient.SETEX('photos', 3600, JSON.stringify(data))
    return res.json(data)
  }
})

app.listen(3000);