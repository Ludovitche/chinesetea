'use strict';

const db = require('../DB')

const getAllOrdersWithTeaList = (req, res) => {
	loggedNoParamsQuery(`
	SELECT T.Name as TeaName, S.Name as ShopName, O.OrderId, O.OrderNumber, O.TrackingNumber, O.Date, 
	O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, ShippingCostInUsdCents 
	
	FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
	left join Tea T on OT.TeaId=T.TeaId`)

	.then(data => data.rows.reduce((orderList, row) => {
			let orderId = row.orderId
			let {teaName, ...orderData} = row
			console.log(orderId)
			console.log(teaName)
			console.log(orderData)
			if (!orderList[orderId]) {
				orderList[orderId].push({
					orderData,
					teaList: [teaName]
				});
			}
			else {
				orderList[orderId].teaList.push(teaName)
			}
			console.log(orderList)
			console.log(orderList[orderId])
			return orderList;
		})
	)
}

module.exports = {
	getAllOrdersWithTeaList: getAllOrdersWithTeaList,
}