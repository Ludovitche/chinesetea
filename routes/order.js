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
- "FK" = foreign key, creates a dropdown list for resource "data", 
  filtered by resource "parent"
- "currency": stored as an integer but displayed with 2 decimals
*/

const formFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "shopid",
    displayLabel: "Shop",
    displayOrder: 1,
    type: "FK",
    data: "shops",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "date",
    displayLabel: "Date",
    displayOrder: 2,
    type: "date",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinbaht",
    displayLabel: "Shipping cost in ฿",
    displayOrder: 7,
    type: "integer",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  }
];

const mapValuesWithFieldDefinitions = row => item => {
  if (item.type === "url") {
    const urlField = row[item.data];
    console.log(urlField);
    return {
      ...item,
      data: row[urlField],
      value: row[item.dbFieldName]
    };
  } else {
    return {
      ...item,
      value: row[item.dbFieldName]
    };
  }
};

const getOrder = (req, res) =>
  db
    .query(SQL_QUERY_GET_ORDER, [req.params["orderId"]])
    .then(result =>
      formFields.map(mapValuesWithFieldDefinitions(result.rows[0]))
    )
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const orderListFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "date",
    displayLabel: "Date",
    displayOrder: 1,
    type: "date",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "shopname",
    displayLabel: "Shop",
    displayOrder: 2,
    type: "url",
    data: "shopurl",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  }
];

const SQL_QUERY_MANAGE_ORDERS = `
SELECT T.TeaId, T.Name as TeaName, S.Name as ShopName, S.url as ShopUrl, 
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
    const orderFields = orderListFields.map(
      mapValuesWithFieldDefinitions(orderData)
    );
    orderList[orderId] = {
      ...orderFields,
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
