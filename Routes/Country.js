'use strict';

const queries = require('../query')

const SQL_QUERY_MANAGE_COUNTRIES = `
SELECT DISTINCT C.*, (T.TeaId is null and A.AreaId is null) as CanDelete
FROM Country C left join Tea T on C.CountryId=T.CountryId left join Area A on C.CountryId=A.CountryId
`

const getAllCountries = (req, res) => queries.getQueryNoParams(SQL_QUERY_MANAGE_COUNTRIES)
.then(data => res.status(200).send(data))
.catch(e => {
	console.log(e.stack)
	res.status(500).send(e)
})


module.exports = {
	getAllCountries: getAllCountries,
}