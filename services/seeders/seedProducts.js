'use strict';

const Product = require('../../models/Product');
const mongoose = require('mongoose');
const CONFIG = require('../../config/dev/config');
const mongoUri = require('../../utils/dbConnection').mongoUri;

// Objeto para crear el administrador
const products = [
	new Product({
		code: '123451',
		productName: 'Base Kryolan',
		cost: 9.5, // Costo de compra por paquete
		price: Math.round((9.5 / 0.7).toFixed(2)), // Precio de venta (Ganancia del 40%)
		quantity: 120, // Cantidad reflejada en paquetes
		productType: 'base',
		productImages: [
			'path/to/product/image',
			'path/to/product/image',
			'path/to/product/image'
		],
		brand: 'Kryolan',
		description: 'lqkwlqwqmqkmwmqkmwkqmwmqkmwqe'
	}),
	new Product({
		code: '123452',
		productName: 'Base Salome',
		cost: 10, // Costo de compra por paquete
		price: Math.round((10 / 0.7).toFixed(2)), // Precio de venta (Ganancia del 40%)
		quantity: 100, // Cantidad reflejada en paquetes
		productType: 'base',
		productImages: [
			'path/to/product/image',
			'path/to/product/image',
			'path/to/product/image'
		],
		brand: 'Kryolan',
		description: 'axxxccffff'
	}),
	new Product({
		code: '123453',
		productName: 'Paleta de sombras - James Charles',
		cost: 11.5, // Costo de compra por paquete
		price: Math.round((11.5 / 0.7).toFixed(2)), // Precio de venta (Ganancia del 40%)
		quantity: 42, // Cantidad reflejada en paquetes
		productType: 'sombra',
		productImages: [
			'path/to/product/image',
			'path/to/product/image',
			'path/to/product/image'
		],
		brand: 'Salome',
		description: 'qwertyqkwjqkmdnandmaqq'
	}),
	new Product({
		code: '123454',
		productName: 'Paleta de sombras - Carnival',
		cost: 13.5, // Costo de compra por paquete
		price: Math.round((13.5 / 0.7).toFixed(2)), // Precio de venta (Ganancia del 40%)
		quantity: 63, // Cantidad reflejada en paquetes
		productType: 'sombra',
		productImages: [
			'path/to/product/image',
			'path/to/product/image',
			'path/to/product/image'
		],
		brand: 'Salome',
		description: 'eqeuuwieyuqhrqwnfnfqwnvowqijiqiwquroiqrjo'
	})
];

// Conexion de la base de datos
mongoose
	.connect(mongoUri, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.catch((err) => {
		console.log(err.stack);
		process.exit(1);
	})
	.then(() => {
		console.log('Conectado a la base de datos');
	});

const createProducts = async () => {
	products.map(async (p, index) => {
		await p.save((err, result) => {
			if (err && Object.keys(err).indexOf('errors') > 0) {
				console.log('Error al ingresar productos ::: ', err.errors);
				mongoose.disconnect();
			} else if (index === products.length - 1) {
				console.log('Productos creados exitosamente: ', products);
				mongoose.disconnect();
			}
		});
	});
};

createProducts();
