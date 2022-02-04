"use strict";

const globalVar = require("../utils/serverCreation");
const dollarRate = require("../files/dollarRate.json");
const Utilities = require("../utils/utilities");

class ProductService {
  /**
   * Servico que permite obtener todos los productos
   * @param data --> Información del pedido
   */
  static async createOrder(data) {
    try {
      const productsIds = data.products.map((element) => element.productId);
      const products = await globalVar.models.Product.find({
        _id: { $in: productsIds },
      });

      if (products.length !== 0) {
        let productsUpdated = 0;
        let totalAmount = 0;
        let quantityOfProducts = [];

        for (let i = 0; i < data.products.length; i++) {
          // Hago match con el producto recibido y el de la base de datos
          let product = products.find(
            (element) => data.products[i].productId === element.id
          );

          if (product && product._doc.quantity >= data.products[i].quantity) {
            product._doc.quantity -= data.products[i].quantity; // Reduzco el inventario del producto
            quantityOfProducts.push(product._doc.quantity);
            totalAmount += data.products[i].quantity * data.products[i].price; // Multiplico la cantidad * el precio del producto (Total factura)
            data.products[i].amount =
              data.products[i].quantity * data.products[i].price;
            productsUpdated += 1;
          } else {
            return Utilities.answerError(
              error,
              globalVar.errors.productNotUpdated,
              202
            );
          }
        }

        for (let index = 0; index < productsIds.length; index++) {
          await globalVar.models.Product.updateOne(
            { _id: productsIds[index] },
            { quantity: quantityOfProducts[index] }
          );
        }

        // En caso que el tipo de pago sea distinto a 'zelle', asigno el monto en bsf (pago_movil o bsf_transferencia)
        data.total =
          data.paymentType === "zelle"
            ? totalAmount
            : totalAmount * dollarRate.usd.dollarToday;
        const order = await globalVar.models.Order.create(data);
        data.orderId = order._doc._id;

        return Utilities.answerOk(
          { data },
          globalVar.successMessages.orderGenerated,
          200
        );
      } else {
        console.log(`${globalVar.errors.orderNotGenerated} ::: POST /orders`);
        return Utilities.answerError(
          {},
          globalVar.errors.orderNotGenerated,
          202
        );
      }
    } catch (error) {
      console.log(`${globalVar.errors.unknownError} ::: POST /orders ${error}`);
      return Utilities.answerError(error, globalVar.errors.unknownError, 500);
    }
  }

  /**
   * Servicio que permite actualizar el status de un pedido
   * @param data --> Informacion del cambio de status (orderId, status)
   */
  static async changeStatus(data) {
    try {
      const orderStatusUpdated = await globalVar.models.Order.findOneAndUpdate(
        { _id: data.orderId },
        { status: data.status }
      );
      return Utilities.answerOk(
        { status: orderStatusUpdated._doc.status },
        globalVar.successMessages.orderStatusChanged,
        200
      );
    } catch (error) {
      console.log(
        `${globalVar.errors.unknownError} ::: PUT /orders/status ${error}`
      );
      return Utilities.answerError(error, globalVar.errors.unknownError, 500);
    }
  }
}

module.exports = ProductService;
