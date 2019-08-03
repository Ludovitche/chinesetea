'use strict';

const db = require('../DB')

const getAllAreasWithCountryNameCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT A.AreaId, A.Name, C.CountryId, C.Name as CountryName, T.TeaId is null as CanDelete 
FROM Area A join Country C on A.CountryId=C.CountryId left join Tea T on A.AreaId=T.AreaId
`)
const getAreaListByCountry = db.rawDataQuery(`
SELECT AreaId, Name 
FROM Area 
WHERE CountryId=$1`
,['countryId'])

module.exports = {
	getAllAreasWithCountryNameCheckFK: getAllAreasWithCountryNameCheckFK,
	getAreaListByCountry: getAreaListByCountry,
}