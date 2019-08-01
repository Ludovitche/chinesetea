'use strict';

const db = require('../DB')

const getAllCurrencies = db.rawDataSimpleQuery('SELECT CurrencyId, Code, Name FROM Currency')

module.exports = {
	getAllCurrencies: getAllCurrencies,
}