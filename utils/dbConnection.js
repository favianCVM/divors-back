'use strict';

const globalVariable = require('./serverCreation');
const mongoose = globalVariable.libs.mongoose;
const devConfig = require('../config/dev/config');

// Opciones y parámetros de la base de datos
const options = {
	useNewUrlParser: true,
	// autoIndex: false, // No buildear indices
	// reconnectTries: Number.MAX_VALUE, // Nunca se detiene de intentar la reconexion
	// Mantener mas de 10 conexiones de sockets
	// poolSize: 10,
	// Si no se conectó, retorna errores inmediatamente en vez de esperar a reconectarse
	// bufferMaxEntries: 0,
	// connectTimeoutMS: 10000, // Renunciar a la conexión inicial después de 10 segundos
	// poolSize: globalVariable.config.mongo.maxDbConnections,
	// promiseLibrary: mongoose.Promise,
	// socketTimeoutMS: 45000, // Cerrar sockets despues de 45 segundos de inactividad
	useUnifiedTopology: true
	// family: 4 // Usar IPv4, ignorar IPv6
};

const devCFG = devConfig.mongo;
const mongoUri = `mongodb://${devCFG.url}:${devCFG.port}/${devCFG.db}`;

const connect = () => {
	console.log('database URI :::', mongoUri);
	return new Promise(async (resolve, reject) => {
		console.log('Database is connecting ...');
		try {
			let res = await mongoose.connect(mongoUri, options);
			console.info('Database connected :::');
			resolve(res);
		} catch (error) {
			reject(error);
		}
	});
};

// Obtengo la conexión por defecto
const db = mongoose.connection;

// Bindeo la conexión al pull de eventos de errores (Para obtener notificaciones de errores de conexion)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const closerdb = {
	connection: db,
	mongoose,
	connect,
	mongoUri
};

module.exports = closerdb;
