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
    // console.log(schema.validate('req.body.password', { list: true }))
    return res.status(403).json({
      error:
        'Le mot de passe doit contenir au moins 8 caractères dont au moins un chiffre et une majuscule (les espaces sont ne sont pas autorisés).',
    })
  }
}
