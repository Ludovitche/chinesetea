"use strict";

const db = require("../db");

const SQL_QUERY_GET_ORDER = `
select * from "order"
where OrderId=$1`;

/* 
In the client, the behaviour of a few fields will be harcoded, 
but for other fields, the client will create components dynamically using 
objects below

Note about special types:
- "PK" = primary key, not displayed
- "FK" = foreign key, creates a dropdown list linked to the ressource after ':'
- "currency": stored as an integer but displayed with 2 decimals
*/

const formFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    filteredBy: "",
    mandatory: true
  },
  {
    dbFieldName: "shopid",
    displayLabel: "Shop",
    displayOrder: 1,
    type: "FK:shops",
    filteredBy: "",
    mandatory: true
  },
  {
    dbFieldName: "date",
    displayLabel: "Date",
    displayOrder: 2,
    type: "date",
    filteredBy: "",
    mandatory: true
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    filteredBy: "",
    mandatory: true
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    filteredBy: "",
    mandatory: false
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    filteredBy: "",
    mandatory: true
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    filteredBy: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinbaht",
    displayLabel: "Shipping cost in ฿",
    displayOrder: 7,
    type: "integer",
    filteredBy: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    filteredBy: "",
    mandatory: false
  }
];

const mapValuesWithFieldDefinitions = item => ({
  ...item,
  value: result.rows[0][item.dbFieldName]
});

const getOrder = (req, res) =>
  db
    .query(SQL_QUERY_GET_ORDER, [req.params["orderId"]])
    .then(result => formFields.map(mapValuesWithFieldDefinitions))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const SQL_QUERY_MANAGE_ORDERS = `
SELECT T.TeaId, T.Name as TeaName, S.Name as ShopName, S.url, 
O.OrderId, O.OrderNumber, O.TrackingNumber, 
to_char(O.Date, 'DD/MM/YYYY') as OrderDate, O.TotalAmountInBaht, 
O.ShippingCostInBaht, O.TotalAmountInUsdCents, O.ShippingCostInUsdCents 

FROM "order" O join Shop S on S.ShopId=O.ShopId 
left join OrderTea OT on O.OrderId=OT.OrderId 
left join Tea T on OT.TeaId=T.TeaId`;

// Unflatten the result: array of Orders, each Order contains a list of Teas
const groupTeasByOrder = (orderList, row) => {
  const orderId = row.orderid - 1;
  const { teaname, teaid, ...orderData } = row;
  if (!orderList[orderId]) {
    orderList[orderId] = {
      ...orderData,
      teaList: teaid ? [{ teaId: teaid, teaName: teaname }] : []
    };
  } else {
    if (teaid) {
      orderList[orderId].teaList.push({ teaId: teaid, teaName: teaname });
    }
  }
  return orderList;
};

const getAllOrdersAndTeas = (req, res) => {
  return db
    .simpleQuery(SQL_QUERY_MANAGE_ORDERS)
    .then(data => data.rows.reduce(groupTeasByOrder, []))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

module.exports = {
  getAllOrdersAndTeas: getAllOrdersAndTeas,
  getOrder: getOrder
};
