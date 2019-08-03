'use strict';

const db = require('../DB')

const getAllCurrencies = db.rawDataSimpleQuery(`
SELECT CurrencyId, Code, Name 
FROM Currency
`)

const getAllCurrenciesCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT C.*, (O.OrderId is null and C.CurrencyId > 2) as CanDelete
FROM Currency C left join Order O on C.CurrencyId=O.totalamountcurrencyid
`)

module.exports = {
	getAllCurrencies: getAllCurrencies,
	getAllCurrenciesCheckFK: getAllCurrenciesCheckFK,
}