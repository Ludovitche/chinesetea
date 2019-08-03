'use strict';

const db = require('../DB')

const getAllOrdersWithTeaList = db.rawDataSimpleQuery(`
SELECT T.Name as TeaName, S.Name as ShopName, O.OrderId, O.OrderNumber, O.TrackingNumber, O.Date, 
O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, ShippingCostInUsdCents 

FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
left join Tea T on OT.TeaId=T.TeaId`)

/*
const getAllOrdersWithTeaList = (req, res) => {
	loggedNoParamsQuery(`
	SELECT T.Name as TeaName, S.Name as ShopName, O.OrderId, O.OrderNumber, O.TrackingNumber, O.Date, 
	O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, ShippingCostInUsdCents 
	
	FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
	left join Tea T on OT.TeaId=T.TeaId`)
	.then(data => {
		const TeaList = data.rows.map(row => row.TeaName)
		const 
	})
}
*/

module.exports = {
	getAllOrdersWithTeaList: getAllOrdersWithTeaList,
}