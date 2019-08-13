"use strict";

const db = require("../db");
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
    .simpleQuery(SQL_QUERY_MANAGE_ORDERS)
    .then(data => data.rows.reduce(groupTeasByOrder, []))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const getOrderFields = (req, res) => res.status(200).send(fields.formFields);

module.exports = {
  getOrderFields: getOrderFields,
  getAllOrdersAndTeas: getAllOrdersAndTeas,
  getOrderById: getOrderById
};
