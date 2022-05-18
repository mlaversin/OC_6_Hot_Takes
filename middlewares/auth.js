const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId
    // the following line allows user verification in the controller when deleting a sauce
    req.auth = { userId: userId }
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Identifiant utilisateur non valide !'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' })
  }
}