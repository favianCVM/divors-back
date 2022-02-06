'use strict';

const globalVar = require('../utils/serverCreation');
const Utilities = require('../utils/utilities');
const models = require('../models');
class UserService {
	/**
	 * Servicio para crear un nuevo usuario
	 * @param {Object} userData Información completa del usuario
	 */
	static create(userData) {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await models.User.findOne({
					email: userData.email
				});

				if (user) {
					console.info(`${globalVar.errors.userAlreadyExist} ::: POST /users`);
					return reject(
						Utilities.answerError({}, globalVar.errors.userAlreadyExist, 202)
					);
				} else {
					userData.password = await globalVar.libs.bcrypt.hash(
						userData.password,
						globalVar.saltRoundsBcrypt
					);
					userData.status = 'active'; //By default the user is going to be created as active

					const response = await models.User.create(userData);
					return resolve(
						Utilities.answerOk(
							{ user: response },
							globalVar.successMessages.userCreated,
							200
						)
					);
				}
			} catch (error) {
				console.error(
					`${globalVar.errors.unknownError} ::: POST /users ${error}`
				);
				return reject(
					Utilities.answerError(error, globalVar.errors.unknownError, 500)
				);
			}
		});
	}
}

module.exports = UserService;
