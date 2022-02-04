const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const formidable = require("express-formidable");
const helmet = require("helmet")

dotenv.config();

const server = express();

/**
 * MIDDLEWARES
 */
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());
server.use(formidable());

/**
 * ROUTES
 */
const routes = require("./routes");

server.use(routes);



/**
 * SERVER INIT
*/ 

 const cronService = require('./services/dollarRateService');

 const globalVariable = require("./utils/serverCreation")


 const cfg = globalVariable.config.mongo;
 const mongoUri = `mongodb://${cfg.user}:${cfg.pw}@${cfg.url}:${cfg.port}/${cfg.db}?authSource=admin`;
 
 console.log("mongoURI :::", mongoUri)

 try {
  console.log("server's running ...");
  console.log("Working directory: ", __dirname);

  server.use (
    helmet(), // Middlewares para añadir seguridad en los headers de respuesta
    helmet.frameguard({action: 'deny'}),
    bodyParser.json({
      limit: '1mb',
      parameterLimit: '10000'
    }),
    bodyParser.urlencoded({ extended: true }),
    routes,
    (req, res, next) => {
      if(globalVariable.useCors && globalVariable.targetEnv === 'dev'){
        res.header("Access-Control-Allow-Origin", globalVariable.config.corsOrigin);
      }
      //res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
      res.header("X-Content-Type-Options", "nosniff");
      /* if ('OPTIONS' === req.method) {
          res.sendStatus(200);
      } else {
          next();
      } */
    }
  )
  
  // CORS + Ambiente de desarrollo 
  if (globalVariable.useCors && globalVariable.targetEnv === 'dev') {

    http.createServer(server).listen(process.env.PORT, () => {
      console.info(`server running in port: ${process.env.PORT}`);
      cronService.executeDollarRateCron();
    });

  } else { // CORS + Ambiente de produccion 
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
  console.error("Error initializing server ::: ", error);
}


