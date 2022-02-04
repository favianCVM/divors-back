"use strict";

const mongoose = require("mongoose");
const globalVar = require("../utils/serverCreation");
const ObjectId = require("mongoose").Types.ObjectId;

const PagoMovilType = new mongoose.Schema({
  bank: { type: String },
  phoneNumber: { type: String },
  identification: { type: String },
});

const TransferenceBsfType = new mongoose.Schema({
  confirmationNumber: { type: String },
  originAccount: { type: String },
  bank: { type: String },
  identification: { type: String },
});

const ZelleType = new mongoose.Schema({
  confirmationNumber: { type: String },
  email: { type: String },
  whoTransfered: { type: String },
});

/**
 * Modelo para guardar los pedidos de los usuarios
 * @param deliveryAddress --> Direccion de entrega
 * @param user --> ID del usuario que esta realizando el pedido
 * @param products --> Array de productos con cantidad solicitada
 */
const OrderSchema = new mongoose.Schema(
  {
    deliveryAddress: String,
    user: { type: ObjectId, ref: "User" },
    products: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ["in_progress", "shipped", "delivered"],
      default: "in_progress",
    },
    paymentType: {
      type: String,
      enum: ["pago_movil", "bsf_transferencia", "zelle"],
    },
    paymentInfo: {
      type: Object,
      enum: [PagoMovilType, TransferenceBsfType, ZelleType],
    },
    total: Number, // Mostrado en dolares o bsf dependiendo del tipo de pago
    createdAt: { type: String, default: globalVar.timezone },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", OrderSchema, "orders");
