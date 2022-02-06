'use strict';

const globalVar = require('./serverCreation');
const regexOnlyLetters = /^[a-zA-Z ]*$/;
const regOnlyNumbers = /^[0-9]*$/;
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
const regexPhoneNumber =
	/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

class Utilities {
	/// CONVERTIR ESTE UTIL A UNA PROMISE
	static async isUserAuthenticated(req) {
		return new Promise(async (resolve, reject) => {
			let token = req.headers['authorization'];

			console.log('token :', token);

			if (!token) {
				return reject(
					Utilities.answerError({}, globalVar.errors.notLoggedIn, 401)
				);
			}

			token = token.replace('Bearer ', '');

			try {
				// Verifico si el token es valido
				const response = await globalVar.libs.jwt.verify(
					token,
					globalVar.saltJwt
				);
				const tokenVerified = await models.UserSession.findOne({
					token: token
				});

				if (tokenVerified) {
					return resolve(
						Utilities.answerOk(response, globalVar.errors.authenticated, 200)
					);
				} else {
					return reject(
						Utilities.answerError(
							tokenVerified,
							globalVar.errors.invalidToken,
							401
						)
					);
				}
			} catch (error) {
				if (error.message === 'jwt expired') {
					// The token is already expired so I remove from UserSession table
					const deletedTokenResponse = await models.UserSession.deleteOne({
						token: req.headers['authorization']
					});
					return reject(
						Utilities.answerError(
							deletedTokenResponse,
							globalVar.errors.tokenExpired,
							401
						)
					);
				} else if (
					error.message === 'invalid signature' ||
					error.message === 'jwt malformed' ||
					error.message === 'invalid token'
				) {
					return reject(
						Utilities.answerError(error, globalVar.errors.invalidToken, 400)
					);
				}
			}
		});
	}

	static answerOk(data, message, statusCode) {
		if (!data) data = {};
		if (!message) message = '';
		return { ...data, message, statusCode: statusCode };
	}

	static answerError(error, message, statusCode) {
		if (!statusCode) statusCode = 500;
		if (!message) message = '';
		if (!error) error = 'Unknown Error';
		return { error, message, statusCode };
	}

	static logError({ error, method, route }) {
		console.error(
			`${
				typeof error === 'object'
					? error.message
					: globalVar.errors.unknownError
			} ::: GET /login ${JSON.stringify(error)}`
		);
	}

	/**
	 * Metodo para validar si el correo electronico es valido
	 */
	static validateEmail(value) {
		if (value && regexEmail.test(value)) return true;
		return false;
	}

	static validateAuthFields = ({ email, password }) => {
		return new Promise((resolve, reject) => {
			if (!email || !this.validateEmail(email) || !password) {
				this.answerError({}, globalVar.errors.invalidCredentials, 500);
			} else resolve(true);
		});
	};

	/**
	 * Metodo para validar si el valor solo tiene letras
	 */
	static validateOnlyLetters(value) {
		if (value && regexOnlyLetters.test(value)) return true;
		return false;
	}

	/**
	 * Metodo para validar si el valor solo tiene numeros
	 */
	static validateOnlyNumbers(value) {
		if (value && regOnlyNumbers.test(value)) return true;
		return false;
	}

	/**
	 * Metodo para validar si el valor es un status válido ('active' o 'inactive')
	 */
	static validateUserStatus(value) {
		if (value && (value === 'active' || value === 'inactive')) return true;
		return false;
	}

	/**
	 * Metodo para validar si el valor es un numero de telefono valido
	 * Casos validos:
	 *   (123) 456-7890,
	 *   (123)456-7890,
	 *   123-456-7890,
	 *   123.456.7890,
	 *   1234567890,
	 *   +31636363634,
	 *   075-63546725
	 */
	static validatePhoneNumber(value) {
		if (value && regexPhoneNumber.test(value)) return true;
		return false;
	}

	//CONVERTIR ESTE METODO A UNA PROMISE
	static validateProducts(products, updateInventory) {
		let validProducts = true;

		// Ningun producto es incluido en el arreglo
		if (products.length === 0) {
			return false;
		} else {
			for (let i = 0; i < products.length; i++) {
				if (
					(updateInventory &&
						(Object.keys(products[i]).indexOf('cost') === -1 ||
							!products[i].cost)) ||
					Object.keys(products[i]).indexOf('profit') === -1
				) {
					validProducts = false;
					break;
				}

				if (
					Object.keys(products[i]).indexOf('productId') === -1 ||
					Object.keys(products[i]).indexOf('quantity') === -1 ||
					Object.keys(products[i]).indexOf('price') === -1 ||
					!products[i].productId ||
					(products[i].productId.length !== 24 &&
						products[i].productId.length !== 12) ||
					!products[i].quantity ||
					typeof products[i].quantity !== 'number' ||
					!products[i].price ||
					typeof products[i].price !== 'number'
				) {
					validProducts = false;
					break;
				}
			}
			return validProducts;
		}
	}

	// ESTE TAMBIEN A PROMISE
	static validateProductType(value) {
		if (value && (value === 'base' || value === 'sombra' || value === 'bolsa'))
			return true;
		return false;
	}

	// ESTE +>>>>>>>
	static validateOrderStatus(value) {
		if (value && (value === 'shipped' || value === 'delivered')) {
			return true;
		}
		return false;
	}

	/**
	 * Metodo para validar si el tipo de pago es correcto
	 */

	// ESTE TAMBIEN
	static validatePaymentType(value) {
		if (
			value &&
			(value === 'pago_movil' ||
				value === 'bsf_transferencia' ||
				value === 'zelle')
		) {
			return true;
		}
		return false;
	}

	/**
	 * Metodo para validar atributos dentro de la informacion de pago según su
	 * tipo de pago
	 */
	// ESTE TAMBIEN =>>>>>
	static validatePaymentInformation(paymentInfo, paymentType) {
		if (!paymentInfo) {
			return false;
		}

		switch (paymentType) {
			case 'pago_movil':
				if (
					Object.keys(paymentInfo).indexOf('bank') === -1 ||
					Object.keys(paymentInfo).indexOf('phoneNumber') === -1 ||
					Object.keys(paymentInfo).indexOf('identification') === -1 ||
					!paymentInfo.bank ||
					globalVar.banks.indexOf(paymentInfo.bank) === -1 ||
					!paymentInfo.phoneNumber ||
					!this.validatePhoneNumber(paymentInfo.phoneNumber) ||
					!paymentInfo.identification ||
					(paymentInfo.identification.split('-')[0] !== 'J' &&
						paymentInfo.identification.split('-')[0] !== 'V' &&
						paymentInfo.identification.split('-')[0] !== 'E') ||
					isNaN(paymentInfo.identification.split('-')[1])
				) {
					return false;
				}
				return true;
			case 'bsf_transferencia':
				if (
					Object.keys(paymentInfo).indexOf('confirmationNumber') === -1 ||
					Object.keys(paymentInfo).indexOf('originAccount') === -1 ||
					Object.keys(paymentInfo).indexOf('bank') === -1 ||
					Object.keys(paymentInfo).indexOf('identification') === -1 ||
					!paymentInfo.confirmationNumber ||
					!paymentInfo.originAccount ||
					paymentInfo.originAccount.length !== 20 ||
					!paymentInfo.bank ||
					globalVar.banks.indexOf(paymentInfo.bank) === -1 ||
					!paymentInfo.identification(
						paymentInfo.identification.split('')[0] !== 'J' ||
							paymentInfo.identification.split('')[0] !== 'V' ||
							paymentInfo.identification.split('')[0] !== 'E'
					) ||
					isNaN(paymentInfo.identification.split('')[1])
				) {
					return false;
				}
				return true;
			case 'zelle':
				if (
					Object.keys(paymentInfo).indexOf('confirmationNumber') === -1 ||
					Object.keys(paymentInfo).indexOf('email') === -1 ||
					Object.keys(paymentInfo).indexOf('whoTransfered') === -1 ||
					!paymentInfo.confirmationNumber ||
					!this.validateEmail(paymentInfo.email) ||
					!paymentInfo.whoTransfered
				) {
					return false;
				}
				return true;
			default:
				// El tipo de pago no es alguno de los comprobados anteriormente
				return false;
		}
	}
}

module.exports = Utilities;
