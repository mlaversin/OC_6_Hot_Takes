require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

/*
 * Configure database connection
 */
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URI}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connected to database !'))
  .catch(() => console.log('Database connection failure !'))

/*
 * Parses incoming JSON requests and puts the parsed data in req.body
 */
app.use(express.json())

/*
 * Secure the app by setting various HTTP headers
 */
app.use(helmet({ crossOriginResourcePolicy: false }))

/*
 * Limit the number of requests from the same IP address
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

/*
 * Allows cross-origin requests
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app
