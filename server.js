
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const movieData = require('./movie-data')

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})




app.get('/movie', function handleGetMovie(req, res) {
  let response = movieData;

  
  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  if (req.query.country) {
    response = response.filter(item =>
      item.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }
if (req.query.avg_vote) {
  response = response.filter(item =>
    Number(item.avg_vote) >= Number(req.query.avg_vote)
  
  )
}


  res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})