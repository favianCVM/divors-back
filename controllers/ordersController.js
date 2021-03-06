'use strict';

const globalVar = require('../utils/serverCreation');
const Utilities = require('../utils/utilities');
const OrderService = require('../services/orderService');
const models = require('../models');

/**
 * Controlador que permite generar un pedido
 * @param req.body.deliveryAddress --> Direccion de entrega del pedido
 * @param req.body.user --> Usuario que esta realizando el pedido
 * @param req.body.products --> Array de productos a incluir en el pedido
 * @param req.body.paymentType --> Tipo de pago para procesar el pedido (pago_movil, bsf_transferencia, zelle)
 * @param req.body.paymentInfo --> Informacion del pago que se realizó
 */
const generateOrder = async (req, res) => {
	const { fields: body, files } = req;

	const { deliveryAddress, products, paymentType, paymentInfo, user } = body;
	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			console.error(`${globalVar.errors.invalidCredentials} ::: POST /orders`);
			return res.json(authentication);
		} else if (
			!deliveryAddress ||
			!products ||
			products.length === 0 ||
			!Utilities.validatePaymentType(paymentType) ||
			!Utilities.validatePaymentInformation(paymentInfo, paymentType) ||
			!Utilities.validateProducts(products)
		) {
			console.log(`${globalVar.errors.invalidParams} ::: POST /orders`);
			return res.json(
				Utilities.answerError({}, globalVar.errors.invalidParams, 400)
			);
		} else {
			const { email } = await globalVar.libs.jwt.decode(
				req.headers['authorization'],
				{ json: true }
			);
			const userRequester = await models.User.findOne({
				email: email
			});

			if (userRequester) {
				user = userRequester._doc._id.toString(); // Asigno el id del usuario logueado
				const response = await OrderService.createOrder(body);
				return res.json(response);
			} else {
				console.log(`${globalVar.errors.unauthorized} ::: POST /orders`);
				return res.json(
					Utilities.answerError({}, globalVar.errors.unauthorized, 401)
				);
			}
		}
	} catch (error) {
		console.error(`${globalVar.errors.unknownError} ::: POST /orders ${error}`);
		return res.json(
			Utilities.answerError(error, globalVar.errors.unknownError, 500)
		);
	}
};

const changeOrderStatus = async (req, res) => {
	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			console.log(
				`${globalVar.errors.invalidCredentials} ::: PUT /orders/status`
			);
			return res.json(authentication);
		} else if (
			!req.body.orderId ||
			(req.body.orderId.length !== 24 && req.body.orderId.length !== 12) ||
			!Utilities.validateOrderStatus(req.body.status)
		) {
			console.log(`${globalVar.errors.invalidParams} ::: PUT /orders/status`);
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
			const response = await OrderService.changeStatus(req.body);
			return res.json(response);
		} else {
			return res.json(
				Utilities.answerError({}, globalVar.errors.unauthorized, 401)
			);
		}
	} catch (error) {
		console.log(
			`${globalVar.errors.unknownError} ::: PUT /orders/status ${error}`
		);
		return res.json(
			Utilities.answerError(error, globalVar.errors.unknownError, 500)
		);
	}
};

module.exports = {
	generateOrder,
	changeOrderStatus
};
