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

// Unflatten the result: array of Orders, each Order has a list of Tea names
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
RETURNING OrderId
`;

const modifyOrder = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_ORDER,
  ["orderId"],
  orderFields
);

const SQL_QUERY_DELETE_ORDER = `
DELETE FROM "order"
WHERE orderId=$1
RETURNING orderId
`;

const SQL_QUERY_DELETE_ORDERTEAS = `
DELETE FROM OrderTea
WHERE OrderId=$1
RETURNING OrderId
`;

// get the teas linked to this order but not linked to any other order
const SQL_QUERY_GET_TEAS_TO_DELETE = `
SELECT T.TeaId FROM Tea T
JOIN OrderTea TO1 on T.TeaId=TO1.TeaId and TO1.OrderId=$1
LEFT JOIN OrderTea TO2 on T.TeaId=TO2.TeaId and TO2.OrderId<>$1
WHERE TO2.OrderTeaId IS NULL
`;

const SQL_QUERY_DELETE_TEAS_BY_ID_START = `
DELETE FROM Tea
WHERE TeaId IN (
`;

const SQL_QUERY_DELETE_TEAS_BY_ID_END = `
)
RETURNING TeaId
`;

const createTeasDeleteQuery = (queryStartText, queryEndText, parameters) => {
  const query =
    queryStartText +
    parameters.map((param, index) => "$" + (index + 1)).join() +
    queryEndText;
  return query;
};

const deleteTeasPromise = (poolClient, teasToDelete) => {
  if (teasToDelete.length > 0) {
    return db.clientQuery(
      poolClient,
      createTeasDeleteQuery(
        SQL_QUERY_DELETE_TEAS_BY_ID_START,
        SQL_QUERY_DELETE_TEAS_BY_ID_END,
        teasToDelete
      ),
      teasToDelete
    );
  } else {
    return Promise.resolve([]);
  }
};

const deleteOrderTeasPromise = (poolClient, orderId) =>
  db.clientQuery(poolClient, SQL_QUERY_DELETE_ORDER, [orderId]);

const deleteOrderAndOrderTeasAndTeas = (poolClient, orderId) => {
  return db
    .query(SQL_QUERY_GET_TEAS_TO_DELETE, [orderId])
    .then(queryResult => {
      var teasToDelete = queryResult.rows.map(row => row.teaid);
      return db
        .clientQuery(poolClient, "BEGIN", [])
        .then(() =>
          db.clientQuery(poolClient, SQL_QUERY_DELETE_ORDERTEAS, [orderId])
        )
        .then(() =>
          Promise.all([
            deleteOrderTeasPromise(poolClient, orderId),
            deleteTeasPromise(poolClient, teasToDelete)
          ])
        );
    })
    .then(queryResult => {
      console.log(queryResult);
      if (queryResult[0].rows.length > 0 && queryResult[0].rows[0].orderid) {
        db.clientQuery(poolClient, "COMMIT", []);
        return queryResult.rows[0];
      } else {
        throw "Error: Order not deleted";
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      console.log(e.stack);
      throw e;
    })
    .finally(poolClient.release());
};

const deleteOrder = (req, res) =>
  db
    .getClient(deleteOrderAndOrderTeasAndTeas, [req.params["orderId"]])
    .then(rows => res.status(200).send(rows))
    .catch(e => res.status(500).send(e));

module.exports = {
  getOrderFields: getOrderFields,
  getAllOrdersAndTeas: getAllOrdersAndTeas,
  getOrderById: getOrderById,
  createOrder: createOrder,
  modifyOrder: modifyOrder,
  deleteOrder: deleteOrder
};
