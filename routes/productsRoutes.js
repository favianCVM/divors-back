'use strict';

const router = require('express').Router();
const ProductsController = require('../controllers/productsController');

router.get('/', ProductsController.getProducts);
router.put('/update', ProductsController.updateProductInventory);
router.all('*', (req, res, next) => {
    res.json({
        message: 'Recurso no encontrado',
        statusCode: 404
    })
});

module.exports = router;