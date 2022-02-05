'use strict';

const Utilities = require('../utils/utilities');
const ProductService = require('../services/productService');
const globalVar = require('../utils/serverCreation');
const models = require("../models")

/**
 * Controlador que permite obtener todos los productos
 */
const getProducts = async (req, res) => {
	const { fields: body, files } = req;

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
	const { fields: body, files } = req;

	const { products } = body;
	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			console.log(
				`${globalVar.errors.invalidCredentials} ::: PUT /products/update`
			);
			return res.json(authentication);
		} else if (
			!products ||
			products.length === 0 ||
			!Utilities.validateProducts(products)
		) {
			console.log(`${globalVar.errors.invalidParams} ::: PUT /products/update`);
			return res.json(
				Utilities.answerError({}, globalVar.errors.invalidParams, 400)
			);
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
			console.log(`${globalVar.errors.unauthorized} ::: PUT /products/update`);
			return res.json(
				Utilities.answerError({}, globalVar.errors.unauthorized, 401)
			);
		}
	} catch (error) {
		console.log(
			`${globalVar.errors.unknownError} ::: PUT /products/update ${error}`
		);
		return res.json(
			Utilities.answerError(error, globalVar.errors.unknownError, 500)
		);
	}
};

module.exports = {
	getProducts,
	updateProductInventory
};
