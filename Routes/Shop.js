'use strict';

const db = require('../DB')

const getAllShops = db.rawDataSimpleQuery(`
SELECT ShopId, Name, Url 
FROM Shop
`)

const getAllShopsCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT S.*, T.TeaId is null as CanDelete
FROM Shop S left join Tea T on S.ShopId=T.ShopId
`)

module.exports = {
	getAllShops: getAllShops,
	getAllShopsCheckFK: getAllShopsCheckFK,
}