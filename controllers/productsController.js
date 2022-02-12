'use strict';

const Utilities = require('../utils/utilities');
const ProductService = require('../services/productService');
const globalVar = require('../utils/serverCreation');
const models = require('../models');

/**
 * Controlador que permite obtener todos los productos
 */
const getProducts = async (req, res) => {
	try {
		const response = await ProductService.getAll();
		return res.json(response);
	} catch (error) {
		console.log(`${globalVar.errors.unknownError} ::: GET /products ${error}`);
		return res.json(
			Utilities.answerError(error, globalVar.errors.unknownError, 500)
		);
	}
};

/**
 * Controlador para actualizar el inventario de productos
 * @param req.body.products --> Informacion de cada producto actualizar
 */
const updateProductInventory = async (req, res) => {
	const { body, files } = req;

	const { products } = body;

	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			Utilities.logError({
				error: globalVar.errors.invalidCredentials,
				method: 'PUT',
				route: '/products/update'
			});

			return res.status(401).json(authentication);
		} else if (
			!products ||
			products.length === 0 ||
			!Utilities.validateProducts(products)
		) {
			Utilities.logError({
				error: globalVar.errors.invalidParams,
				method: 'PUT',
				route: '/products/update'
			});

			return res
				.status(400)
				.json(Utilities.answerError({}, globalVar.errors.invalidParams, 400));
		}

		const { email } = await globalVar.libs.jwt.decode(
			req.headers['authorization'],
			{ json: true }
		);
		const userRequester = await models.User.findOne({ email: email });

		if (userRequester && userRequester.userType === 'admin') {
			const response = await ProductService.updateProducts(products);
			return res.json(response);
		} else {
			Utilities.logError({
				error: globalVar.errors.unauthorized,
				method: 'PUT',
				route: '/products/update'
			});

			return res
				.status(401)
				.json(Utilities.answerError({}, globalVar.errors.unauthorized, 401));
		}
	} catch (error) {
		Utilities.logError({
			method: 'PUT',
			error,
			route: '/products/update'
		});

		return res
			.status(500)
			.json(
				Utilities.answerError(
					error,
					typeof error === 'object'
						? error.message
						: globalVar.errors.unknownError,
					typeof error === 'object' ? error.statusCode : 500
				)
			);
	}
};

/**
 * Controlador para realizar busqueda de productos en el inventario de productos
 * @param req.query --> Informacion de cada producto actualizar
 */
const searchProducts = (req, res) => {

}

/**
 * Controlador para realizar busqueda de un producto en especifico en el inventario de productos
 * @param req.query --> Informacion de cada producto actualizar
 */
const getProduct = (req, res) => {

}

module.exports = {
	getProducts,
	updateProductInventory,
	searchProducts,
	getProduct
};
