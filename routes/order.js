"use strict";

const db = require("../db");
const queries = require("../query");
const fields = require("../clientFieldList/orderFields");
const {
  createComponents,
  createComponentsWithUrl
} = require("../clientFieldList/utils");

const SQL_QUERY_GET_ORDER = `
SELECT OrderId, ShopId, to_char(Date, 'DD/MM/YYYY') as OrderDate,
OrderNumber, TrackingNumber, TotalAmountInBaht, TotalAmountInUsdCents,
ShippingCostInBaht, ShippingCostInUsdCents

FROM "order"
WHERE OrderId=$1
`;

const getOrderById = (req, res) =>
  db
    .query(SQL_QUERY_GET_ORDER, [req.params["orderId"]])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const SQL_QUERY_MANAGE_ORDERS = `
SELECT T.TeaId, T.Name as TeaName, O.orderid, 
to_char(O.Date, 'DD/MM/YYYY') as OrderDate,
S.Name as ShopName, S.url as ShopUrl, 
O.TotalAmountInBaht, O.OrderNumber, O.TrackingNumber, O.TotalAmountInUsdCents,
O.ShippingCostInUsdCents

FROM "order" O 
JOIN Shop S ON S.ShopId=O.ShopId 
LEFT JOIN OrderTea OT ON O.OrderId=OT.OrderId 
LEFT JOIN Tea T ON OT.TeaId=T.TeaId

ORDER BY O.Date
`;

// Unflatten the result: array of Orders, each Order contains a list of Teas
const groupTeasByOrder = (orderList, row) => {
  const orderId = row.orderid - 1;
  const { teaname, teaid, ...orderData } = row;
  if (!orderList[orderId]) {
    const components = fields.displayFields.map(
      createComponentsWithUrl(orderData)
    );
    orderList[orderId] = {
      order: components,
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
    .query(SQL_QUERY_MANAGE_ORDERS)
    .then(data => data.rows.reduce(groupTeasByOrder, []))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const getOrderFields = (req, res) => res.status(200).send(fields.formFields);

const SQL_QUERY_NEW_ORDER = `
INSERT INTO "order"
VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (ordernumber)
DO NOTHING
RETURNING OrderId
`;

const orderFields = [
  "shopid",
  "date",
  "totalamountinbaht",
  "totalamountinusdcents",
  "shippingcostinbaht",
  "shippingcostinusdcents",
  "trackingnumber",
  "ordernumber"
];

const createOrder = queries.updateQueryRoute(
  SQL_QUERY_NEW_ORDER,
  [],
  orderFields
);

const SQL_QUERY_MODIFY_ORDER = `
UPDATE "order"
SET shopid = $2, date = $3, totalamountinbaht = $4, totalamountinusdcents = $5, 
shippingcostinbaht = $6, shippingcostinusdcents = $7, trackingnumber = $8, 
ordernumber = $9
WHERE OrderId=$1
`;

const modifyOrder = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_ORDER,
  ["orderid"],
  orderFields
);

module.exports = {
  getOrderFields: getOrderFields,
  getAllOrdersAndTeas: getAllOrdersAndTeas,
  getOrderById: getOrderById,
  createOrder: createOrder,
  modifyOrder: modifyOrder
};
