'use strict';

const db = require('../DB')

const getAllTypes = db.rawDataSimpleQuery('SELECT TypeId, Name FROM Type')

module.exports = {
	getAllTypes: getAllTypes,
}