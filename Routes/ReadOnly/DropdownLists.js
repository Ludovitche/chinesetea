'use strict';

const db = require('../../DB')

const getCurrentRoleListWithId = db.rawDataSimpleQuery('SELECT currentroleid, name FROM CurrentRole')

module.exports = {
	getCurrentRoleListWithId: getCurrentRoleListWithId
}