'use strict';

const router = require('express').Router();
const OrdersController = require('../controllers/ordersController');

router.post('/', OrdersController.generateOrder);
router.put('/status', OrdersController.changeOrderStatus);
router.all('*', (req, res, next) => {
    res.json({
        message: 'Recurso no encontrado',
        statusCode: 404
    })
});

module.exports = router;