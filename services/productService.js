"use strict";

const globalVar = require("../utils/serverCreation");
const Utilities = require("../utils/utilities");

class ProductService {
  /**
   * Servico que permite obtener todos los productos
   */
  static async getAll() {
    try {
      const products = await globalVar.models.Product.find();
      return Utilities.answerOk(
        { products },
        globalVar.successMessages.productsFound,
        200
      );
    } catch (error) {
      console.log(
        `${globalVar.errors.unknownError} ::: GET /products ${error}`
      );
      return Utilities.answerError(error, globalVar.errors.unknownError, 500);
    }
  }

  /**
   * Servicio que permite actualizar el inventario como tambien
   * costo y precio de cada producto
   * @param products --> Array de cada producto
   */
  static async updateProducts(products) {
    try {
      let allProductsUpdated = [];

      for (let i = 0; i < products.length; i++) {
        let product = await globalVar.models.Product.findOne({
          _id: products[i]._id,
        });

        if (product) {
          const currentProfit = products[i].profit
            ? products[i].profit
            : product._doc.profit;

          // Si el costo del producto fue modificado y es mayor al ya guardado en BD
          // Actualizo el costo y el precio
          if (products[i].cost > product._doc.cost) {
            product._doc.cost = products[i].cost;
            product._doc.price = products[i].cost / currentProfit;
          }

          // Si el margen de ganancia es distinto contra el margen guardado en BD,
          // Actualizo el margen de ganancia del producto y el precio de venta
          if (currentProfit !== product._doc.profit) {
            product._doc.profit = currentProfit;
            product._doc.price = products[i].cost / currentProfit;
          }

          // Si la cantidad es > 0, actualizo el inventario, sino no hago cambios
          if (products[i].quantity > 0) {
            product._doc.quantity = +products[i].quantity;
          }

          allProductsUpdated.push(products._doc);
        } else {
          return Utilities.answerError(
            {},
            globalVar.errors.productsNotFound,
            202
          );
        }
      }

      for (let i = 0; i < allProductsUpdated.length; i++) {
        await globalVar.models.Product.updateOne(
          { _id: productsIds[index] },
          allProductsUpdated[i]
        );
      }

      return Utilities.answerOk(
        { products: allProductsUpdated },
        globalVar.successMessages.productsUpdated,
        200
      );
    } catch (error) {
      console.log(
        `${globalVar.errors.unknownError} ::: PUT /products/update ${error}`
      );
      return Utilities.answerError(error, globalVar.errors.unknownError, 500);
    }
  }
}

module.exports = ProductService;
