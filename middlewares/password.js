const passwordValidator = require('password-validator')

const schema = new passwordValidator()

schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces()
  .is().not().oneOf(['Passw0rd', 'Password123', 'M0tdepasse', 'motdepass3', 'motd3passe']) // Blacklist these values

module.exports = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    next()
  } else {
    res.statusMessage =
      'The password must contain a minimum of 8 characters including at least one number and one capital letter (spaces are not allowed)'
    return res.status(400).send()
  }
}
