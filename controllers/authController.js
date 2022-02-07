'use strict';

const Utilities = require('../utils/utilities');
const AuthService = require('../services/authService');
const globalVar = require('../utils/serverCreation');
const models = require('../models');

/**
 * Controlador para autenticar al usuario
 * POST
 * @param email --> Correo electronico del usuario
 * @param password --> Contraseña del usuario
 */

const authenticateUser = async (req, res) => {
	const { body, files } = req;

	const { email, password } = body;

	try {
		await Utilities.validateAuthFields({ email, password });

		let response = await AuthService.authenticate(body);
		return res.json(response);
	} catch (error) {
		Utilities.logError({
			method: 'GET',
			error,
			route: '/login'
		});

		return res
			.status(error.statusCode || 400)
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
 * Controlador para realizar logout y matar la sesion
 * del usuario
 * GET
 */
const killSession = async (req, res) => {
	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			Utilities.logError({
				method: 'GET',
				route: '/logout',
				error: globalVar.errors.invalidCredentials
			});

			return res.status(401).json(authentication);
		}

		const token = req.headers['authorization'].replace('Bearer ', '');

		const { email } = await globalVar.libs.jwt.decode(token, { json: true });

		const userRequester = await models.User.findOne({ email: email });

		if (userRequester) {
			const session = await models.UserSession.findOneAndDelete({
				user: userRequester.id,
				token
			});
			if (session) {
				return res.json(
					Utilities.answerOk(
						{ session: session._doc },
						globalVar.successMessages.sessionKilledSuccess,
						200
					)
				);
			} else {
				return res
					.status(400)
					.json(
						Utilities.answerError({}, globalVar.errors.sessionKilledFailed, 400)
					);
			}
		}
	} catch (error) {
		Utilities.logError({
			method: 'GET',
			error,
			route: '/logout'
		});

		return res
			.status(error.statusCode || 400)
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
 * Controlador para validar el estado de la sesion
 * GET
 */
const checkStatus = async (req, res) => {
	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			Utilities.logError({
				method: 'GET',
				route: '/session-status',
				error: globalVar.errors.invalidCredentials
			});

			return res.status(401).json(authentication);
		} else {
			return res.status(200).json(authentication);
		}
	} catch (error) {
		Utilities.logError({
			method: 'GET',
			error,
			route: '/session-status'
		});

		return res
			.status(error.statusCode || 400)
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

module.exports = {
	authenticateUser,
	killSession,
	checkStatus
};
