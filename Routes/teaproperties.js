'use strict';

const db = require('../DB')
const queries = require('../query')

const SQL_QUERY_GET_AREAS = `
SELECT AreaId, Name, CountryId
FROM Area`


const getAllFormats = queries.getQueryNoParams('SELECT FormatId, Name FROM Format')
const getAllCurrentRoles = queries.getQueryNoParams('SELECT CurrentRoleId, Name FROM CurrentRole')
const getAllLocations = queries.getQueryNoParams('SELECT LocationId, Name FROM Location')

module.exports = {
	getAllTeaDropdownLists: getAllFormats,
}

