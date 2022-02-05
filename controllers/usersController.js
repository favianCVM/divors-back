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
	const { fields: body, files } = req;

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
			fname ||
			lname ||
			email ||
			password ||
			uniqueId ||
			phoneNumber ||
			address ||
			status ||
			!Utilities.validateOnlyLetters(fname) ||
			!Utilities.validateOnlyLetters(lname) ||
			!Utilities.validateEmail(email) ||
			!Utilities.validateUserStatus(status) ||
			!Utilities.validatePhoneNumber(phoneNumber)
		) {
			console.log(`${globalVar.errors.invalidParams} ::: POST /users`);
			return res.json(
				Utilities.answerError({}, globalVar.errors.invalidParams, 400)
			);
		} else {
			const response = await UserService.create(body);
			return res.json(response);
		}
	} catch (error) {
		console.log(`${globalVar.errors.unknownError} ::: POST /users ${error}`);
		return res.json(
			Utilities.answerError(error, globalVar.errors.unknownError, 500)
		);
	}
};

module.exports = {
	createUser
};
