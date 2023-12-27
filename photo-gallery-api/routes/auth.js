/**
 * Module dependencies.
 */
const express = require('express');

/**
 * Express router.
 */
const router = express.Router();

/**
 * Auth controller.
 */
const controller = require('../controllers/authController')

/**
 * Auth middleware.
 */
const auth = require('../middlewares/auth')

/**
 * photoUploader middleware.
 */
const photoUploader = require('../middlewares/photoUploader')

/**
 * Routes.
 */
router.post('/login', controller.login)
router.post('/register', photoUploader.single('profilePicture'), controller.register)
router.get('/me', auth.check, controller.me)

module.exports = router;
