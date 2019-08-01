'use strict';

const db = require('../DB')

const getAllCurrentRoles = db.rawDataSimpleQuery('SELECT CurrentRoleId, Name FROM CurrentRole')

module.exports = {
	getAllCurrentRoles: getAllCurrentRoles,
}