'use strict';

const queries = require('../query')

const SQL_QUERY_MANAGE_CURRENCIES = `
SELECT DISTINCT C.*, (O.OrderId is null and C.CurrencyId > 2) as CanDelete
FROM Currency C left join "order" O on C.CurrencyId=O.totalamountcurrencyid
`

const getAllCurrencies = (req, res) => queries.getQueryNoParams(SQL_QUERY_MANAGE_CURRENCIES)
.then(data => res.status(200).send(data))
.catch(e => {
	console.log(e.stack)
	res.status(500).send(e)
})

module.exports = {
	getAllCurrencies: getAllCurrencies,
}