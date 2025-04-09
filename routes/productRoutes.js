const express = require('express');
const productController = require('../controllers/productController');
const jwtMiddleware = require('../middleware/auth');
const upload = require('../middleware/multerMiddleware');

const productRouter = express.Router();

productRouter.post('/', jwtMiddleware, upload.single('productImage'), productController.addProductController);
productRouter.put('/:id', jwtMiddleware, upload.single('productImage'), productController.editProductController);
productRouter.delete('/:id', jwtMiddleware, productController.deleteProductController);
productRouter.get('/', jwtMiddleware, productController.getAllProductsController);
productRouter.get('/my-products', jwtMiddleware, productController.getMyProductsController);

module.exports = productRouter;
