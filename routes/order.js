"use strict";

const db = require("../db");
const fields = require("../clientFieldList/orderFields");
const {
  createComponents,
  createComponentsWithUrl
} = require("../clientFieldList/utils");

const SQL_QUERY_GET_ORDER = `
select * from "order"
where OrderId=$1`;

const getOrder = (req, res) =>
  db
    .query(SQL_QUERY_GET_ORDER, [req.params["orderId"]])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

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
    const fields = fields.listFields.map(createComponentsWithUrl(orderData));
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
