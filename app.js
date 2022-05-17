require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URI}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Échec de la connexion à MongoDB !'))

app.use(express.json())

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

app.get('/api/sauces', (req, res, next) => {
  console.log('toutes les sauces')
})

app.post('/api/sauces', (req, res, next) => {
  console.log(req.body)
  res.status(201).json({ message: 'Objet créé !' })
})

module.exports = app
