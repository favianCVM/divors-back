// Configuracion para ambiente de desarrollo

const config = {
    corsOrigin: 'http://localhost:3000',
    logLevel: 'debug',
    maxFileUploadSizeInMB: 10, 
    mongo: {
        mongodb_url: 'mongodb://localhost:27017/closer_db', 
        db: 'closer_db', 
        maxDbConnections: 10, 
        pw: '123456', 
        port: 27017, 
        url: 'localhost', 
        user: 'closeradmin'
    }, 
    host: 'localhost',
    port: 8080,
    protocol: 'http',
    saltRounds: 10,
    serverUrl: 'http://localhost:3333',
    storageDefaultInMb: 10
};

module.exports = config;