'use strict';

const mongoose = require('mongoose');
const globalVar = require('../utils/serverCreation');
const ObjectId = require('mongoose').Types.ObjectId;

const UserSessionSchema = new mongoose.Schema(
	{
		token: String,
		user: { type: ObjectId, ref: 'User' },
		createdAt: { type: String, default: globalVar.timezone }
	},
	{
		versionKey: false
	}
);

module.exports = mongoose.model('UserSession', UserSessionSchema);
