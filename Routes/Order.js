'use strict';

const db = require('../DB')

const getAllOrdersWithTeaList = (req, res) => {
	return db.simpleQuery(`
	SELECT T.TeaId, T.Name as TeaName, T.url, S.Name as ShopName, O.OrderId, O.OrderNumber, O.TrackingNumber, 
	O.Date, O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, ShippingCostInUsdCents 
	
	FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
	left join Tea T on OT.TeaId=T.TeaId`)

	.then(data => data.rows.reduce((orderList, row) => {
		let orderId = row.orderid - 1
		let { teaname, teaid, ...orderData } = row
		if (!orderList[orderId]) {
			orderList[orderId] = ({
				...orderData,
				teaList: teaid ? [{teaId: teaid, teaName: teaname}] : []
			})
		}
		else {
			if (teaid) {
				orderList[orderId].teaList.push({teaId: teaid, teaName: teaname})
			}
		}
		return orderList;
	}, []))
	.then(data => res.status(200).send(data))
	.catch(e => {
		console.log(e.stack)
		res.status(400).send(e)
	})
}

module.exports = {
	getAllOrdersWithTeaList: getAllOrdersWithTeaList,
}