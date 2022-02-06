'use strict';

const router = require('express').Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../utils/jwtMiddleware');
const globalVar = require('../utils/serverCreation');

const { admin } = globalVar.userTypes;

router.post('/login', AuthController.authenticateUser);
router.get('/logout', AuthController.killSession);
router.all('*', (req, res, next) => {
	res.json({
		message: 'Recurso no encontrado',
		statusCode: 404
	});
});

module.exports = router;
