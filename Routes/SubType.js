'use strict';

const db = require('../DB')

const getAllSubTypesWithTypeName = db.rawDataSimpleQuery('SELECT S.SubTypeId, S.Name, T.TypeId, T.Name as TypeName FROM SubType S join Type T on S.typeId=T.TypeId')
const getSubTypeListByType = db.rawDataQuery('SELECT SubTypeId, Name FROM SubType WHERE TypeId=$1',['typeId'])

module.exports = {
	getAllSubTypesWithTypeName: getAllSubTypesWithTypeName,
	getSubTypeListByType: getSubTypeListByType,
}