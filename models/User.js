'use strict';

const mongoose = require('mongoose');
const globalVar = require('../utils/serverCreation');

/**
 * Modelo para guardar los usuarios
 * @param fname --> Nombre del usuario
 * @param lname --> Apellido del usuario
 * @param email --> Correo electrónico del usuario
 * @param password --> Contraseña del usuario
 * @param uniqueId --> Identificion unica del usuario (Cedula, pasaporte)
 * @param phoneNumber --> Telefono del usuario
 * @param address --> Direccion del usuario
 * @param status --> Estatus del usuario ('active' o 'inactive')
 */
const UserSchema = new mongoose.Schema(
	{
		fname: String,
		lname: String,
		email: String,
		password: String,
		uniqueId: String, // Numero de identificacion (Cedula, pasaporte)
		phoneNumber: String,
		address: String,
		status: {
			type: String,
			enum: ['active', 'inactive']
		},
		userType: {
			type: String,
			enum: ['admin', 'common']
		},
		createdAt: { type: String, default: globalVar.timezone }
	},
	{
		versionKey: false
	}
);

module.exports = mongoose.model('User', UserSchema, 'users');
