'use strict';

const db = require('../DB')

const getAllFormats = db.rawDataSimpleQuery('SELECT FormatId, Name FROM Format')

module.exports = {
	getAllFormats: getAllFormats,
}