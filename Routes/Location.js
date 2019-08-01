'use strict';

const db = require('../DB')

const getAllLocations = db.rawDataSimpleQuery('SELECT LocationId, Name FROM Location')

module.exports = {
	getAllLocations: getAllLocations,
}