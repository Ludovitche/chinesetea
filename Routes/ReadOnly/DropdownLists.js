'use strict';

const db = require('../../DB')

const getCurrentRoleListWithId = db.rawDataSimpleQuery('SELECT CurrentRoleId, Name FROM CurrentRole')
const getTypeListWithId = db.rawDataSimpleQuery('SELECT TypeId, Name FROM Type')
const getLocationListWithId = db.rawDataSimpleQuery('SELECT LocationId, Name FROM Location')
const getShopListWithId = db.rawDataSimpleQuery('SELECT ShopId, Name, Url FROM Shop')
const getFormatListWithId = db.rawDataSimpleQuery('SELECT FormatId, Name FROM Format')
const getCurrencyListWithId = db.rawDataSimpleQuery('SELECT CurrencyId, Code, Name FROM Currency')
const getCountryListWithId = db.rawDataSimpleQuery('SELECT CountryId, Name FROM Country')

const getSubTypeListWithId = db.rawDataQuery('SELECT SubTypeId, Name FROM SubType WHERE TypeId=$1')
const getAreaListWithId = db.rawDataQuery('SELECT AreaId, Name FROM Area WHERE CountryId=$1')


module.exports = {
	getTypeListWithId: getTypeListWithId,
	getSubTypeListWithId: getSubTypeListWithId,

	getCountryListWithId: getCountryListWithId,
	getAreaListWithId: getAreaListWithId,

	getFormatListWithId: getFormatListWithId,
	getShopListWithId: getShopListWithId,
	getCurrencyListWithId: getCurrencyListWithId,
	getLocationListWithId: getLocationListWithId,
	getCurrentRoleListWithId: getCurrentRoleListWithId,
}