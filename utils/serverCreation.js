'use strict';

// Librerías
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const moment = require('moment-timezone');
const timezone = moment.tz('America/Caracas').format('YYYY-MM-DD hh:mm:ss A');

// Longitud de argumentos en script (dev-server / prod-server)
const arglen = process.argv ? process.argv.length : 0;
const targetEnv = (arglen > 3) ? process.argv[2].split("=")[1] : 'dev'; // Tipo de ambiente a usar? dev/prod Por defecto=dev
const useCors = (arglen > 3) ? process.argv[3].split("=")[1] : 'false'; // Se usa cors? - Si/No - Por defecto=false
const config = require("../config/" + targetEnv + "/config");

// Modelos

const globalVariable = {
    libs: {
        mongoose,
        jwt,
        bcrypt,
        randomstring
    },
    models: {
    },
    presentation: [
        '10kg',
        '20kg',
        '30kg',
        '40kg'
    ],
    banks: [
        'Banco Mercantil',
        'Banco Provicial',
        'Banesco Banco Universal',
        'Banco de Venezuela',
        'Banco Nacional de Crédito',
        'Banco Exterior',
        'Banplus Banco Universal',
        'Banco Bicentenario',
        'Banco Occidental de Descuento',
        'Bancaribe'
    ],
    timezone,
    saltJwt: 'ULEbA9HkmF5teZpGWLmuaRr',
    saltRoundsBcrypt: 10,
    dollarRateUrl: 'https://s3.amazonaws.com/dolartoday/data.json',
    targetEnv,
    useCors,
    config,
    errors: {
        invalidParams: 'Parámetros inválidos',
        invalidCredentials: 'Credenciales inválidas',
        notLoggedIn: 'No autorizado',
        unauthorized: 'El usuario no puede realizar esta acción',
        requesterNotExist: 'The requester doesn\'t exist',
        invalidToken: 'Token inválido',
        tokenExpired: 'Token expirado',
        userNotFound: 'El usuario no fue encontrado',
        userNotUpdated: 'El usuario no pudo ser actualizado',
        userNotCreated: 'El usuario no pudo ser creado',
        userAlreadyExist: 'El usuario ya existe',
        userInactive: 'El usuario se encuentra inactivo',
        sessionKilledFailed: 'Cierre de sesión fallido',
        productsNotFound: 'Productos no encontrados',
        productNotUpdated: 'Un producto no pudo ser actualizado',
        unknownError: 'Error desconocido',
        orderNotGenerated: 'Pedido no pudo ser generado'
    },
    successMessages: {
        userCreated: 'Usuario creado existosamente',
        userFound: 'Usuario encontrado existosamente',
        userUpdated: 'Usuario actualizado existosamente',
        userStatusUpdated: 'Estatus del usuario actualizado existosamente',
        authenticationDone: 'Inicio de sesión exitoso',
        sessionKilledSuccess: 'Sesión cerrada exitosamente',
        productsFound: 'Productos encontrados exitosamente',
        productsUpdated: 'Productos actualizados exitosamente',
        orderGenerated: 'Pedido generado exitosamente',
        orderStatusChanged: 'Status de pedido cambiada exitosamente'
    }
}

module.exports = globalVariable;

