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
				const usedEmail = await models.User.findOne({
					email: userData.email
				});

				const usedUniqueId = await models.User.findOne({
					uniqueId: userData.uniqueId
				});

				if (usedUniqueId || usedEmail) {
					Utilities.logError({
						error: globalVar.errors.userAlreadyExist,
						method: 'POST',
						route: '/users'
					});

					return reject(
						Utilities.answerError({}, globalVar.errors.userAlreadyExist, 400)
					);
				} else {
					userData.password = await globalVar.libs.bcrypt.hash(
						userData.password,
						globalVar.saltRoundsBcrypt
					);

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
				Utilities.logError({
					error: globalVar.errors.unknownError,
					method: 'POST',
					route: '/users'
				});

				return reject(
					Utilities.answerError(error, globalVar.errors.unknownError, 500)
				);
			}
		});
	}
}

module.exports = UserService;
