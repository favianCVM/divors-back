'use strict';

const CronJob = require('cron').CronJob;
const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');
const globalVar = require('../utils/serverCreation');
const dollarRate = require('../files/dollarRate.json');

// Metodo para actualizar la tasa del dollar del día a través de dollar today

const cronCallback = async () => {
	try {
		const today = moment().format('YYYY-MM-DD hh:mm:ss A');
		const responseFromDollarToday = await axios.get(globalVar.dollarRateUrl);

		if (
			dollarRate &&
			responseFromDollarToday.data.USD.dolartoday !== dollarRate.usd.dollarToday
		) {
			const dollarJson = JSON.stringify({
				usd: {
					dollarToday: responseFromDollarToday.data.USD.dolartoday
				}
			});

			fs.writeFile('files/dollarRate.json', dollarJson, (err, result) => {
				if (err) {
					console.error('El dolar no pudo ser actualizado');
				} else
					console.info(
						`Dolar actualizado: ${responseFromDollarToday.data.USD.dolartoday} - ${today}`
					);
			});
		}
	} catch (error) {
		console.error(error);
	}
};

const dollarRateCron = new CronJob(
	'0 4 * * 1',
	cronCallback,
	null,
	true,
	'America/Caracas'
);

const executeDollarRateCron = () => {
	dollarRateCron.start();
};

module.exports = {
	executeDollarRateCron
};
