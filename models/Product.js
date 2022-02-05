'use strict';

const mongoose = require('mongoose');
const globalVar = require('../utils/serverCreation');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Modelo para guardar los productos
 * @param code --> Código del producto
 * @param productName --> Nombre del producto
 * @param cost --> Costo de compra del producto
 * @param price --> Precio de venta del producto
 * @param quantity --> Precio de venta del producto
 * @param productType --> Tipo de producto (bases, sombras)
 * @param presentation --> Presentación del producto
 */
const ProductSchema = new mongoose.Schema(
	{
		code: String,
		productName: String,
		cost: Number,
		price: Number,
		quantity: Number,
		productType: {
			type: String,
			enum: ['base', 'sombra', 'bolsa']
		},
		productImages: [
			{
				type: String
			}
		],
		brand: String,
		description: String,
		profit: {
			type: Number,
			default: 0.7 // Margen de ganancia del producto (Costo/ganancia)
		},
		createdAt: {
			type: String,
			default: globalVar.timezone
		}
	},
	{
		versionKey: false
	}
);

module.exports = mongoose.model('Product', ProductSchema, 'products');
