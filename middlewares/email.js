const validator = require('validator')

module.exports = (req, res, next) => {
  const { email } = req.body

  if (validator.isEmail(email)) {
    next()
  } else {
    return res.status(400).json({ error: '400: Bad request - email address is invalid !' })
  }
}
