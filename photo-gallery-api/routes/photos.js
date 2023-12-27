/**
 * Module dependencies.
 */
const express = require('express');

/**
 * Express router.
 */
const router = express.Router();

/**
 * Auth middleware.
 */
const auth = require('../middlewares/auth')

/**
 * photoUploader middleware.
 */
const photoUploader = require('../middlewares/photoUploader')
 
/**
 * Photos controller.
 */
const controller = require('../controllers/photosController')

/**
 * Routes.
*/
router.get('/all', controller.getAllPhotos);
router.get('/recentphotos', controller.getLast8Photos);
router.post('/', [auth.check, photoUploader.single('photo')], controller.upload) // 'photo' should match the field name in your form
router.get('/ownphotos', auth.check, controller.getOwnPhotos)
router.get('/:id', controller.find)
router.put('/:id', auth.check, controller.update)
router.delete('/:id', auth.check, controller.delete)
router.post('/:id/reviews', auth.check, controller.addRate)

module.exports = router;
