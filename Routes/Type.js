'use strict';

const queries = require('../query')

const SQL_QUERY_MANAGE_TYPES = `
SELECT DISTINCT TY.*, (T.TeaId is null and ST.SubTypeId is null) as CanDelete
FROM Type TY left join Tea T on TY.TypeId=T.TypeId left join SubType ST on ST.TypeId=T.TypeId`

const getAllTypes = (req, res) => queries.getQueryNoParams(SQL_QUERY_MANAGE_TYPES)
.then(data => res.status(200).send(data))
.catch(e => {
	console.log(e.stack)
	res.status(500).send(e)
})

module.exports = {
	getAllTypes: getAllTypes,
}