'use strict';

const db = require('../db')
const queries = require('../query')

const SQL_QUERY_MANAGE_ORDERS = `
SELECT T.IsSample, T.TeaId, T.Name as TeaName, S.Name as ShopName, S.url, O.OrderId, O.OrderNumber, O.TrackingNumber, 
O.Date, O.TotalAmountInBaht, O.ShippingCostInBaht, O.TotalAmountInUsdCents, O.ShippingCostInUsdCents 

FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
left join Tea T on OT.TeaId=T.TeaId`

const SQL_QUERY_GET_ORDER = `
select * from "order" 
where OrderId=$1`


const getAllOrdersWithTeaList = (req, res) => {
	return db.simpleQuery(SQL_QUERY_MANAGE_ORDERS)
	/*.then(data => data.rows.reduce((orderList, row) => {
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
	}, []))*/
	.then(data => res.status(200).send(data))
	.catch(e => {
		console.log(e.stack)
		res.status(500).send(e)
	})
}

const getOrder = queries.getQuery(SQL_QUERY_GET_ORDER, ['orderId'])


module.exports = {
	getAllOrdersWithTeaList: getAllOrdersWithTeaList,
	getOrder: getOrder,
}