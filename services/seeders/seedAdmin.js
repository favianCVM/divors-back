'use strict';

const bcrypt = require('bcrypt');
const User = require('../../models/User');
const mongoose = require('mongoose');
const CONFIG = require('../../config/dev/config');
const mongoUri = require('../../utils/dbConnection').mongoUri;

// Objeto para crear el administrador
const user = new User({
	fname: 'Javier',
	lname: 'Stifano',
	email: 'closer_admin@gmail.com',
	password: bcrypt.hashSync('admin', CONFIG.saltRounds),
	uniqueId: 'V-24087507', // Numero de identificacion (Cedula, pasaporte)
	phoneNumber: '+58242323288',
	address: 'Colinas de bello monte',
	status: 'active',
	userType: 'admin'
});

// Conexion de la base de datos
mongoose
	.connect(mongoUri, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.catch((err) => {
		console.error(err.stack);
		process.exit(1);
	})
	.then(() => {
		console.log('Conectado a la base de datos');
	});

const createAdmin = async () => {
	await user.save((err, result) => {
		if (err) console.error(err);
		else {
			console.log('Admin agregado satisfactoriamente ', result);

			mongoose.disconnect();
		}
	});
};

createAdmin();
