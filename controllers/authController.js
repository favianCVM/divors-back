'use strict';

const Utilities = require('../utils/utilities');
const AuthService = require('../services/authService');
const globalVar = require('../utils/serverCreation');
const models = require('../models');

/**
 * Controlador para autenticar al usuario
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
			.status(500)
			.json(
				Utilities.answerError(
					error,
					typeof error === 'object' ? error.message : globalVar.errors.unknownError,
					typeof error === 'object' ? error.statusCode : 500
				)
			);
	}
};

/**
 * Controlador para realizar logout y matar la sesion
 * del usuario
 */
const killSession = async (req, res) => {
	try {
		const authentication = await Utilities.isUserAuthenticated(req);

		if (
			authentication.statusCode === 401 ||
			authentication.statusCode === 400
		) {
			console.log(`${globalVar.errors.invalidCredentials} ::: GET /logout`);
			return res.json(authentication);
		}

		const { email } = await globalVar.libs.jwt.decode(
			req.headers['authorization'],
			{ json: true }
		);
		const userRequester = await models.User.findOne({ email: email });

		if (userRequester) {
			const session = await models.UserSession.findOneAndDelete({
				user: userRequester.id,
				token: req.headers['authorization']
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
				return res.json(
					Utilities.answerError({}, globalVar.errors.sessionKilledFailed, 202)
				);
			}
		}
	} catch (error) {
		console.log(`${globalVar.errors.unknownError} ::: GET /logout ${error}`);
		return res.json(
			Utilities.answerError(error, globalVar.errors.unknownError, 500)
		);
	}
};

module.exports = {
	authenticateUser,
	killSession
};
