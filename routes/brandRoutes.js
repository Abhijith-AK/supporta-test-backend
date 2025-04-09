const express = require('express')
const brandController = require('../controllers/brandController')
const jwtMiddleware = require('../middleware/auth')
const upload = require('../middleware/multerMiddleware');

const brandRouter = express.Router()

brandRouter.post('/', jwtMiddleware, upload.single('brandLogo'), brandController.addBrandController)
brandRouter.get('/', jwtMiddleware, brandController.getAllBrandsController)

module.exports = brandRouter
