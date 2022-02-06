'use strict';

const globalVar = require('../utils/serverCreation');
const Utilities = require('../utils/utilities');
const models = require('../models');

class AuthService {
	/**
	 * Servico que permite realizar la autenticación de usuario
	 * @param email --> Correo electronico del usuario
	 * @param password --> Contraseña del usuario
	 */
	static authenticate(user, res) {
		return new Promise(async (resolve, reject) => {
			try {
				const userFound = await models.User.findOne({
					email: user.email
				});

				if (userFound) {
					// Usuario no puede loguearse ya que se encuentra inactivo
					if (userFound.status === 'inactive') {
						console.log(`${globalVar.errors.userInactive} ::: POST /login`);
						return resolve(
							Utilities.answerError({}, globalVar.errors.userInactive, 202)
						);
					}

					const matchPassword = await globalVar.libs.bcrypt.compare(
						user.password,
						userFound.password
					);

					if (matchPassword) {
						let token = '';
						const dataCyphered = {
							email: user.email,
							password: user.password
						};
						const tokenAlive = await models.UserSession.findOne({
							user: userFound._id
						});

						if (tokenAlive) {
							token = tokenAlive.token;
						} else {
							// El token expira luego de las 24 horas
							token = await globalVar.libs.jwt.sign(
								dataCyphered,
								globalVar.saltJwt,
								{ expiresIn: '24h' }
							);
							// Creao la sesion para el usuario
							await models.UserSession.create({
								token: token,
								user: userFound.id
							});
						}

						let objResponse = {
							token: token,
							...userFound
						};

						console.log(`successfull authentication ${userFound.email}`);
						return resolve(
							Utilities.answerOk(
								{ user: objResponse },
								globalVar.successMessages.authenticationDone,
								200
							)
						);
					} else {
						// La autenticacion no puede completarse por credenciales invalidas
						// Contraseña incorrecta
						console.error(`invalid password ::: POST /login`);
						return resolve(
							Utilities.answerError(
								{},
								globalVar.errors.invalidCredentials,
								400
							)
						);
					}
				} else {
					console.error(
						`${globalVar.errors.invalidCredentials} ::: POST /login`
					);
					return reject(
						Utilities.answerError({}, globalVar.errors.invalidCredentials, 400)
					);
				}
			} catch (error) {
				console.error(
					`${globalVar.errors.unknownError} ::: POST /login ${error}`
				);
				return reject(
					Utilities.answerError(error, globalVar.errors.unknownError, 500)
				);
			}
		});
	}
}

module.exports = AuthService;
