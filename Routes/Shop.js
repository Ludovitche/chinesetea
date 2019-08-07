'use strict';

const queries = require('../query')

const SQL_QUERY_MANAGE_SHOPS = `
SELECT DISTINCT S.*, T.TeaId is null as CanDelete
FROM Shop S left join Tea T on S.ShopId=T.ShopId
`

const getAllShops = (req, res) => queries.getQueryNoParams(SQL_QUERY_MANAGE_SHOPS)
.then(data => res.status(200).send(data))
.catch(e => {
	console.log(e.stack)
	res.status(500).send(e)
})

module.exports = {
	getAllShops: getAllShops,
}