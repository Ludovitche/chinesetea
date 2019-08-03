'use strict';

const db = require('../DB')

const getAllSubTypesWithTypeNameCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT S.SubTypeId, S.Name, T.TypeId, T.Name as TypeName, T.TeaId is null as CanDelete
FROM SubType S join Type T on S.typeId=T.TypeId left join Tea T on S.SubTypeId=T.SubTypeId
`)
const getSubTypeListByType = db.rawDataQuery(`
SELECT SubTypeId, Name FROM SubType 
WHERE TypeId=$1`
,['typeId'])

module.exports = {
	getAllSubTypesWithTypeNameCheckFK: getAllSubTypesWithTypeNameCheckFK,
	getSubTypeListByType: getSubTypeListByType,
}