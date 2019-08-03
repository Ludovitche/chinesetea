'use strict';

const db = require('../DB')

const getAllCountries = db.rawDataSimpleQuery(`
SELECT CountryId, Name 
FROM Country
`)

const getAllCountriesCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT C.*, (T.TeaId is null and A.AreaId is null) as CanDelete
FROM Country C left join Tea T on C.CountryId=T.CountryId left join Area A on C.CountryId=A.CountryId
`)

module.exports = {
	getAllCountries: getAllCountries,
	getAllCountriesCheckFK: getAllCountriesCheckFK,
}