const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')

const password = require('../middlewares/password')
const email = require('../middlewares/email')

router.post('/signup', email, password, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router
