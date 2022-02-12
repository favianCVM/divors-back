'use strict';

const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.authenticateUser);
router.get('/logout', AuthController.killSession);
router.get('/session-state', AuthController.checkStatus);
router.all('*', (req, res, next) => {
	res.status(404).json({
		message: 'Recurso no encontrado',
		statusCode: 404
	});
});

module.exports = router;
