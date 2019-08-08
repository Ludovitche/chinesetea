'use strict';

const db = require('../db')

// here we return exactly what the client wants to display
// warning: "order" is a reserved word in postgres, always use quotes

const SQL_QUERY_MANAGE_ORDERS = `
SELECT T.TeaId, T.Name as TeaName, S.Name as ShopName, S.url, O.OrderId, O.OrderNumber, 
O.TrackingNumber, to_char(O.Date, 'DD/MM/YYYY') as OrderDate, O.TotalAmountInBaht, 
O.ShippingCostInBaht, O.TotalAmountInUsdCents, O.ShippingCostInUsdCents 

FROM "order" O join Shop S on S.ShopId=O.ShopId left join OrderTea OT on O.OrderId=OT.OrderId 
left join Tea T on OT.TeaId=T.TeaId`


// here I chose to not have a join because we have only 1 order and 2 DB calls is fine to me

const SQL_QUERY_GET_ORDER = `
select * from "order"
where OrderId=$1`


// mainly to practice my baginner javascript, but also to maybe improve performance (not measured),
// I chose to get all data in 1 sql query, and then use reduce to group by order

const groupTeasByOrder = (orderList, row) => {
	const orderId = row.orderid - 1
	const { teaname, teaid, ...orderData } = row
	if (!orderList[orderId]) {
		orderList[orderId] = ({
			...orderData,
			teaListCount: teaid ? 1 : 0,
			teaList: teaid ? [{teaId: teaid, teaName: teaname}] : []
		})
	}
	else {
		if (teaid) {
			orderList[orderId].teaList.push({teaId: teaid, teaName: teaname})
			orderList[orderId].teaListCount++
		}
	}
	return orderList;
}

const getAllOrdersWithTeaList = (req, res) => {
	return db.simpleQuery(SQL_QUERY_MANAGE_ORDERS)
	.then(data => {
		const teaList = data.rows.reduce(groupTeasByOrder, [])
		return ({
			count: teaList.length,
			data: teaList
		})
	})
	.then(data => res.status(200).send(data))
	.catch(e => {
		console.log(e.stack)
		res.status(500).send(e)
	})
}


// the edit form will be built dynamically: the client will create components for each object in this list

// type:
// PK = primary key and will not create a component 
// FK = foreign key and will create a dropdown list linked to the ressource after ':'
// numeric will use the number of decimals after ':' to display, but will be stored as an integer

// dependency:
// dependency is only for dropdown list that need to be refreshed when another dropdown list is modified

const formFields = [ 
{label: 'orderid', 					displayLabel: 'hidden',				order: -1, 	type: 'PK', 		dependency: '',	mandatory:true},
{label: 'shopid', 					displayLabel: 'Shop',				order: 1, 	type: 'FK:shops', 	dependency: '',	mandatory:true},
{label: 'date', 					displayLabel: 'Date',				order: 2, 	type: 'date',		dependency: '',	mandatory:true},
{label: 'ordernumber', 				displayLabel: 'Order number',		order: 3, 	type: 'text',		dependency: '',	mandatory:true},
{label: 'trackingnumber', 			displayLabel: 'Tracking number',	order: 4, 	type: 'text', 		dependency: '',	mandatory:false},
{label: 'totalamountinusdcents', 	displayLabel: 'Amount in $',		order: 7, 	type: 'numeric:2',	dependency: '',	mandatory:true},
{label: 'shippingcostinusdcents',	displayLabel: 'Shipping cost in $',	order: 8, 	type: 'numeric:2',	dependency: '',	mandatory:false},
{label: 'totalamountinbaht', 		displayLabel: 'Amount in ฿',		order: 9, 	type: 'integer',	dependency: '',	mandatory:false},
{label: 'shippingcostinbaht', 		displayLabel: 'Shipping cost in ฿',	order: 10, 	type: 'integer',	dependency: '',	mandatory:false},
]

const getOrder = (req, res) => db.query(SQL_QUERY_GET_ORDER, [req.params['orderId']])
	.then(result => {
		console.log(result.rows[0])
		const fields = formFields.map(item => ({
        		...item, 
        		value: result.rows[0][item.label]
        	})
		)
		return ({
			count: result.rowCount,
        	data: fields
	    })
	})
	.then(data => res.status(200).send(data))
	.catch(e => {
		console.log(e.stack)
		res.status(500).send(e)
	})
}


module.exports = {
	getAllOrdersWithTeaList: getAllOrdersWithTeaList,
	getOrder: getOrder,
}