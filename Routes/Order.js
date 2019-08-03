'use strict';

const db = require('../DB')

const getAllOrdersWithTeaList = (req, res) => {
	loggedNoParamsQuery(`
	SELECT T.Name as TeaName, S.Name as ShopName, O.OrderId, O.OrderNumber, O.TrackingNumber, O.Date, 
	O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, ShippingCostInUsdCents 
	
	FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
	left join Tea T on OT.TeaId=T.TeaId`)
	.then(data => data.rows.map())
}

module.exports = {
	getAllCurrentRoles: getAllCurrentRoles,
}