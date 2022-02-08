'use strict';

const Utilities = require('../utils/utilities');
const UserService = require('../services/userService');
const globalVar = require('../utils/serverCreation');

/**
 * Controlador que permite crear un nuevo usuario
 * @param {String} fname Primer nombre del usuario
 * @param {String} lname Primer apellido del usuario
 * @param {String} email Correo electrónico del usuario
 * @param {String} password Contraseña del usuario
 * @param {String} uniqueId Identificación única del usuario
 * @param {String} phoneNumber Número de teléfono del usuario
 * @param {String} address Direccion de ubicación del usuario
 * @param {String} status Estatus del usuario ('active' o 'inactive')
 */
const createUser = async (req, res) => {
	const { body, files } = req;

	const {
		fname,
		lname,
		email,
		password,
		uniqueId,
		phoneNumber,
		address,
		status
	} = body;
	try {
		if (
			!fname ||
			!lname ||
			!email ||
			!password ||
			!uniqueId ||
			!phoneNumber ||
			!address ||
			!status ||
			!Utilities.validateOnlyLetters(fname) ||
			!Utilities.validateOnlyLetters(lname) ||
			!Utilities.validateEmail(email) ||
			!Utilities.validateUserStatus(status) ||
			!Utilities.validatePhoneNumber(phoneNumber)
		) {
			Utilities.logError({
				error: globalVar.errors.invalidParams,
				route: '/users',
				method: 'POST'
			});
			return res
				.status(400)
				.json(Utilities.answerError({}, globalVar.errors.invalidParams, 400));
		} else {
			const response = await UserService.create(body);
			return res.json(response);
		}
	} catch (error) {
		Utilities.logError({
			method: 'POST',
			error,
			route: '/users'
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

module.exports = {
	createUser
};
