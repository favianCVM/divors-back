'use strict';

const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.authenticateUser);
router.get('/logout', AuthController.killSession);
router.all('*', (req, res, next) => {
    res.json({
        message: 'Recurso no encontrado',
        statusCode: 404
    })
});

module.exports = router;