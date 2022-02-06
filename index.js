require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const formidable = require('express-formidable');
const helmet = require('helmet');

const server = express();

/**
 * ROUTES
 */
const routes = require('./routes');

server.use(
	morgan('dev'),
	cors(),
	formidable(),
	helmet(), // Middleware para añadir seguridad en los headers de respuesta
	helmet.frameguard({ action: 'deny' }),
	bodyParser.json({
		limit: '1mb',
		parameterLimit: '10000'
	}),
	bodyParser.urlencoded({ extended: true }),
	(req, res, next) => {
		req.body = req.fields;

		console.log('Form data ::: ');
		console.log('body :', req.body);
		console.log('files :', req.files);
		console.log('Headers :::', req.headers);

		next();
	},
	routes
);

/**
 * SERVER INIT
 */

const cronService = require('./services/dollarRateService');
const globalVariable = require('./utils/serverCreation');
const dbConnection = require('./utils/dbConnection');

const startServer = async () => {
	try {
		console.log("server's running ...");
		console.log('Working directory: ', __dirname);

		await dbConnection.connect();

		// CORS + Ambiente de desarrollo
		if (globalVariable.useCors && globalVariable.targetEnv === 'dev') {
			http.createServer(server).listen(process.env.PORT, () => {
				console.info(`server running in port: ${process.env.PORT}`);
				cronService.executeDollarRateCron();
			});
		} else {
			// CORS + Ambiente de produccion
			if (globalVariable.config.protocol === 'http') {
				http.createServer(server).listen(process.env.PORT, () => {
					console.info('info', `server running in port: ${process.env.PORT}`);
					cronService.executeDollarRateCron();
				});
			} else if (globalVariable.config.protocol === 'https') {
				https.createServer(server).listen(process.env.PORT, () => {
					console.info(`server running in port: ${process.env.PORT}`);
					cronService.executeDollarRateCron();
				});
			}
		}
	} catch (error) {
		console.error('Error at initializing server ::: ', error);
	}
};

startServer();
