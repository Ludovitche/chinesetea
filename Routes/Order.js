'use strict';

const db = require('../DB')

const getAllOrdersWithTeaList = (req, res) => {
	return db.simpleQuery(`
	SELECT T.TeaId, T.Name as TeaName, S.Name as ShopName, S.url, O.OrderId, O.OrderNumber, O.TrackingNumber, 
	O.Date, O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, ShippingCostInUsdCents 
	
	FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
	left join Tea T on OT.TeaId=T.TeaId`)

	.then(data => data.rows.reduce((orderList, row) => {
		const orderId = row.orderid - 1
		const { teaname, teaid, ...orderData } = row
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

const getOrder = db.rawDataQuery(`
select * from "order" 
where OrderId=$1`
,['orderId'])

module.exports = {
	getAllOrdersWithTeaList: getAllOrdersWithTeaList,
	getOrder: getOrder,
}