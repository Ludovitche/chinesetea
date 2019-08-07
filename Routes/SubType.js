'use strict';

const queries = require('../query')

const SQL_QUERY_MANAGE_SUBTYPES = `
SELECT DISTINCT S.SubTypeId, S.Name, TY.TypeId, TY.Name as TypeName, T.TeaId is null as CanDelete
FROM SubType S join Type TY on S.typeId=TY.TypeId left join Tea T on S.SubTypeId=T.SubTypeId
`

const getAllSubTypesWithTypeName = (req, res) => queries.getQueryNoParams(SQL_QUERY_MANAGE_SUBTYPES)
.then(data => res.status(200).send(data))
.catch(e => {
	console.log(e.stack)
	res.status(500).send(e)
})

module.exports = {
	getAllSubTypesWithTypeName: getAllSubTypesWithTypeName,
}