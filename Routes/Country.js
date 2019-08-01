'use strict';

const db = require('../DB')

const getAllCountries = db.rawDataSimpleQuery('SELECT CountryId, Name FROM Country')

module.exports = {
	getAllCountries: getAllCountries,
}