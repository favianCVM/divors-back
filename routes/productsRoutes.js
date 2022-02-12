'use strict';

const router = require('express').Router();
const ProductsController = require('../controllers/productsController');

router.get('/', ProductsController.getProducts);
router.get('/:_id', ProductsController.getProduct);
router.get('/search', ProductsController.searchProducts);
router.put('/update/:_id', ProductsController.updateProductInventory);
router.all('*', (req, res, next) => {
	res.status(404).json({
		message: 'Recurso no encontrado',
		statusCode: 404
	});
});

module.exports = router;
