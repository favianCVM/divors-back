'use strict';

const Utilities = require('../utils/utilities');
const UserService = require('../services/userService');
const globalVar = require('../utils/serverCreation');

/**
 * Controlador que permite crear un nuevo usuario
 * @param {String} req.body.fname Primer nombre del usuario
 * @param {String} req.body.lname Primer apellido del usuario
 * @param {String} req.body.email Correo electrónico del usuario
 * @param {String} req.body.password Contraseña del usuario
 * @param {String} req.body.uniqueId Identificación única del usuario
 * @param {String} req.body.phoneNumber Número de teléfono del usuario
 * @param {String} req.body.address Direccion de ubicación del usuario
 * @param {String} req.body.status Estatus del usuario ('active' o 'inactive')
 */
const createUser = async (req, res) => {
    try {
        console.log('Servicio solicitado ::: POST /users');

        if(
            !req.body.fname ||
            !req.body.lname ||
            !req.body.email ||
            !req.body.password ||
            !req.body.uniqueId ||
            !req.body.phoneNumber ||
            !req.body.address ||
            !req.body.status ||
            !Utilities.validateOnlyLetters(req.body.fname) ||
            !Utilities.validateOnlyLetters(req.body.lname) ||
            !Utilities.validateEmail(req.body.email) ||
            !Utilities.validateUserStatus(req.body.status) ||
            !Utilities.validatePhoneNumber(req.body.phoneNumber)
        ) {
            console.log(`${globalVar.errors.invalidParams} ::: POST /users`);
            return res.json(Utilities.answerError({}, globalVar.errors.invalidParams, 400));
        } else {
            const response = await UserService.create(req.body);
            return res.json(response);
        }
    } catch (error) {
        console.log(`${globalVar.errors.unknownError} ::: POST /users ${error}`);
        return res.json(Utilities.answerError(error, globalVar.errors.unknownError, 500));
    }
}

module.exports = {
    createUser
}