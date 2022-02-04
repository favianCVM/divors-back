"use strict";

const globalVariable = require("./serverCreation");
const mongoose = globalVariable.libs.mongoose;

// Opciones y parámetros de la base de datos
const options = {
  useNewUrlParser: true,
  // autoIndex: false, // No buildear indices
  // reconnectTries: Number.MAX_VALUE, // Nunca se detiene de intentar la reconexion
  poolSize: 10, // Mantener mas de 10 conexiones de sockets
  // Si no se conectó, retorna errores inmediatamente en vez de esperar a reconectarse
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Renunciar a la conexión inicial después de 10 segundos
  poolSize: globalVariable.config.mongo.maxDbConnections,
  promiseLibrary: mongoose.Promise,
  socketTimeoutMS: 45000, // Cerrar sockets despues de 45 segundos de inactividad
  useUnifiedTopology: true,
  // family: 4 // Usar IPv4, ignorar IPv6
};

const cfg = globalVariable.config.mongo;
const mongoUri = `mongodb://${cfg.user}:${cfg.pw}@${cfg.url}:${cfg.port}/${cfg.db}?authSource=admin`;

console.log("mongoURI :::", mongoUri)

mongoose.set("useFindAndModify", false);

mongoose
  .connect(mongoUri, options)
  .then((err, db) => {
    console.log("Database connected succesfully.");
  })
  .catch((err) =>
    console.error("Error at database connection ::: ", err)
  );

// Obtengo la conexión por defecto
const db = mongoose.connection;

// Bindeo la conexión al pull de eventos de errores (Para obtener notificaciones de errores de conexion)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const closerdb = {
  connection: db,
  mongoose: mongoose,
};

module.exports = closerdb;
