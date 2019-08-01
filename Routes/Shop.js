'use strict';

const db = require('../DB')

const getAllShops = db.rawDataSimpleQuery('SELECT ShopId, Name, Url FROM Shop')

module.exports = {
	getAllShops: getAllShops,
}