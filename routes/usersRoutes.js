'use strict';

const router = require('express').Router();
const UserController = require('../controllers/usersController');

router.post('/', UserController.createUser);
router.all('*', (req, res, next) => {
	res.json({
		message: 'Recurso no encontrado',
		statusCode: 404
	});
});

module.exports = router;
