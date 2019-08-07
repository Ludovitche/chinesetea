'use strict';

const queries = require('../query')

const SQL_QUERY_MANAGE_CURRENCIES = `
SELECT DISTINCT C.*, (O.OrderId is null and C.CurrencyId > 2) as CanDelete
FROM Currency C left join "order" O on C.CurrencyId=O.totalamountcurrencyid
`

const getAllCurrencies = queries.getQueryNoParams(SQL_QUERY_MANAGE_CURRENCIES)

module.exports = {
	getAllCurrencies: getAllCurrencies,
}