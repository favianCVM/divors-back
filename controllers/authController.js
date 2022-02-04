'use strict';

const Utilities = require('../utils/utilities');
const AuthService = require('../services/authService');
const globalVar = require('../utils/serverCreation');

/**
 * Controlador para autenticar al usuario
 * @param email --> Correo electronico del usuario
 * @param password --> Contraseña del usuario
 */
const authenticateUser = async (req, res) => {
    try {
        console.log('Servicio solicitado ::: POST /login');

        if(!req.body.email || !Utilities.validateEmail(req.body.email) || !req.body.password ) {
            console.error(`${globalVar.errors.invalidParams} ::: POST /login`);
            return res.json(Utilities.answerError({}, globalVar.errors.invalidParams, 400));
        } else {
            const response = await AuthService.authenticate(req.body);
            return res.json(response);
        }
    } catch (error) {
        console.error(`${globalVar.errors.unknownError} ::: GET /login ${error}`);
        return res.json(Utilities.answerError(error, globalVar.errors.unknownError, 500));
    }
}

/**
 * Controlador para realizar logout y matar la sesion 
 * del usuario
 */
const killSession = async(req, res) => {
    try {
        console.log('Servicio solicitado ::: GET /logout');

        const authentication = await Utilities.isUserAuthenticated(req);

        if (authentication.statusCode === 401 || authentication.statusCode === 400) {
            console.log(`${globalVar.errors.invalidCredentials} ::: GET /logout`);
            return res.json(authentication);
        }

        const { email } = await globalVar.libs.jwt.decode(req.headers['authorization'], {json:true});
        const userRequester = await globalVar.models.User.findOne({'email': email});

        if (userRequester) {
            const session = await globalVar.models.UserSession.findOneAndDelete({'user': userRequester.id, 'token': req.headers['authorization']});
            if(session) {
                return res.json(Utilities.answerOk({session: session._doc}, globalVar.successMessages.sessionKilledSuccess, 200));
            } else {
                return res.json(Utilities.answerError({}, globalVar.errors.sessionKilledFailed, 202));
            }
        }
    } catch (error) {
        console.log(`${globalVar.errors.unknownError} ::: GET /logout ${error}`);
        return res.json(Utilities.answerError(error, globalVar.errors.unknownError, 500));
    }
}

module.exports = {
  authenticateUser,
  killSession
}