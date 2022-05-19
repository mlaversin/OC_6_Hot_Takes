const validator = require('validator')

module.exports = (req, res, next) => {
  const { email } = req.body

  if (validator.isEmail(email)) {
    next()
  } else {
    return res.status(403).json({ error: "L'email saisi n'est pas valide !" })
  }
}
