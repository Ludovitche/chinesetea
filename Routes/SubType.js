'use strict';

const db = require('../DB')

const getAllSubTypesWithTypeNameCheckFK = db.rawDataSimpleQuery(`
SELECT DISTINCT S.SubTypeId, S.Name, TY.TypeId, TY.Name as TypeName, T.TeaId is null as CanDelete
FROM SubType S join Type TY on S.typeId=TY.TypeId left join Tea T on S.SubTypeId=T.SubTypeId
`)
const getSubTypeListByType = db.rawDataQuery(`
SELECT SubTypeId, Name FROM SubType 
WHERE TypeId=$1`
,['typeId'])

module.exports = {
	getAllSubTypesWithTypeNameCheckFK: getAllSubTypesWithTypeNameCheckFK,
	getSubTypeListByType: getSubTypeListByType,
}