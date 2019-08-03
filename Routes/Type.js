'use strict';

const db = require('../DB')

const getAllTypes = db.rawDataSimpleQuery(`
SELECT TypeId, Name 
FROM Type`
)

const getAllTypesCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT TY.*, (T.TeaId is null and ST.SubTypeId is null) as CanDelete
FROM Type TY left join Tea T on TY.TypeId=T.TypeId left join SubType ST on ST.TypeId=T.TypeId`
)

module.exports = {
	getAllTypes: getAllTypes,
	getAllTypesCheckFK: getAllTypesCheckFK
}