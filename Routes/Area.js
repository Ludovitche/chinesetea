'use strict';

const db = require('../DB')

const getAllAreasWithCountryName = db.rawDataSimpleQuery(`
SELECT A.AreaId, A.Name, C.CountryId, C.Name as CountryName 
FROM Area A join Country C on A.CountryId=C.CountryId
`)
const getAreaListByCountry = db.rawDataQuery(`
SELECT AreaId, Name 
FROM Area 
WHERE CountryId=$1`
,['countryId'])

module.exports = {
	getAllAreasWithCountryName: getAllAreasWithCountryName,
	getAreaListByCountry: getAreaListByCountry,
}