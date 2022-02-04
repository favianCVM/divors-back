'use strict';

const Utilities = require('../utils/utilities');
const ProductService = require('../services/productService');
const globalVar = require('../utils/serverCreation');

/**
 * Controlador que permite obtener todos los productos
 */
const getProducts = async (req, res) => {
    try {
        const response = await ProductService.getAll();
        return res.json(response);
    } catch (error) {
        console.log(`${globalVar.errors.unknownError} ::: GET /products ${error}`);
        return res.json(Utilities.answerError(error, globalVar.errors.unknownError, 500));
    }
}

/**
 * Controlador para actualizar el inventario de productos
 * @param req.body.products --> Informacion de cada producto actualizar
 */
const updateProductInventory = async (req, res) => {
    try {
        console.log('Servicio solicitado ::: PUT /products/update');

        const authentication = await Utilities.isUserAuthenticated(req);

        if (authentication.statusCode === 401 || authentication.statusCode === 400) {
            console.log(`${globalVar.errors.invalidCredentials} ::: PUT /products/update`);
            return res.json(authentication);
        } else if (
            !req.body.products ||
            req.body.products.length === 0 ||
            !Utilities.validateProducts(req.body.products)
        ) {
            console.log(`${globalVar.errors.invalidParams} ::: PUT /products/update`);
            return res.json(Utilities.answerError({}, globalVar.errors.invalidParams, 400));
        }

        const { email } = await globalVar.libs.jwt.decode(req.headers['authorization'], {json:true});
        const userRequester = await globalVar.models.User.findOne({'email': email});

        if (userRequester && userRequester.userType === 'admin') {
            const response = await ProductService.updateProducts(req.body.products);
            return res.json(response);
        } else {
            console.log(`${globalVar.errors.unauthorized} ::: PUT /products/update`);
            return res.json(Utilities.answerError({}, globalVar.errors.unauthorized, 401));
        }
    } catch (error) {
        console.log(`${globalVar.errors.unknownError} ::: PUT /products/update ${error}`);
        return res.json(Utilities.answerError(error, globalVar.errors.unknownError, 500));
    }
}

module.exports = {
    getProducts,
    updateProductInventory
}