const mongoose = require('mongoose')
const mongooseErrors = require('mongoose-errors')

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    minLength: 3,
    maxLenght: 50,
    match: [/^[a-zA-Z '-]*$/, 'Character(s) not allowed in the name field'],
    required: true,
  },
  manufacturer: {
    type: String,
    minLength: 3,
    maxLenght: 50,
    match: [/^[a-zA-Z '-]*$/, 'Character(s) not allowed in the name field'],
    required: true,
  },
  description: {
    type: String,
    minLength: 10,
    maxLenght: 300,
    match: [
      /^[a-zA-Z '-:.?!]*$/,
      'Character(s) not allowed in the description',
    ],
    required: true,
  },
  mainPepper: {
    type: String,
    minLength: 3,
    maxLenght: 50,
    match: [
      /^[a-zA-Z '-]*$/,
      'Character(s) not allowed in the main pepper ingredient field',
    ],
    required: true,
  },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true, default: [] },
  usersDisliked: { type: [String], required: true, default: [] },
})

sauceSchema.plugin(mongooseErrors)

module.exports = mongoose.model('Sauce', sauceSchema)
