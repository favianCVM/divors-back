'use strict';

const app = require('express').Router();
const authRoutes = require('./authRoutes');
const usersRoutes = require('./usersRoutes');
const productsRoutes = require('./productsRoutes');
const ordersRoutes = require('./ordersRoutes');

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.all('*', (req, res, next) => {
	return res.json({
		message: 'Recurso no encontrado',
		statusCode: 404
	});
});

module.exports = app;
