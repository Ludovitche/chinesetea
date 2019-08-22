"use strict";

const db = require("../db");
const queries = require("../query");
const fields = require("../clientFieldList/teaFields");
const filters = require("../clientFieldList/teaFilterFields");
const { createComponents } = require("../clientFieldList/utils");

// this query gets the weight of current Order (OT2) + the weight for all orders
// + the weight for all orders (OT1) in a single request (OVERKILL !)
const SQL_QUERY_GET_TEA_BY_ID_FOR_SPECIFIC_ORDER = `
SELECT T.TeaId, T.Name, T.ShopId, T.TypeId, T.SubTypeId, T.CountryId, T.Areaid,
T.Formatid, T.WeightInGrams, T.LastPurchasePriceInUsdCents, T.IsSample, 
OT2.AmountInGrams, 
T.Comments, T.Received, T.Gone, T.OutOfStock, T.CurrentroleId, T.LocationId,
T.LastPurchaseYear, T.Url, T.VendorDescription, 
sum(OT1.AmountInGra ms) as TotalWeightBoughtInGrams, 
T.AmountConsumedInGrams

FROM Tea T JOIN OrderTea OT1 ON OT1.TeaId=T.TeaId
JOIN OrderTea OT2 ON OT2.TeaId=T.TeaId AND OT2.OrderId=$2
WHERE T.TeaId=$1
GROUP BY T.TeaId, OT2.AmountInGrams
`;

const getTeaByTeaIdAndOrderId = (req, res) =>
  db
    .query(SQL_QUERY_GET_TEA_BY_ID_FOR_SPECIFIC_ORDER, [
      req.params["teaId"],
      req.params["orderId"]
    ])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

// this query does the same than SQL_QUERY_GET_TEA_BY_ID_FOR_SPECIFIC_ORDER but
// instead of having the OrderId in input, it finds the most recent order,
// all in 1 request (DOUBLE OVERKILL ! just an exercise)
const SQL_QUERY_GET_TEA_BY_ID_FOR_LAST_ORDER = `
SELECT T.TeaId, T.Name, T.ShopId, T.TypeId, T.SubTypeId, T.CountryId, T.AreaId,
T.FormatId, T.WeightInGrams, T.LastPurchasePriceInUsdCents, T.IsSample, 
OT2.AmountInGrams, 
T.Comments, T.Received, T.Gone, T.OutOfStock, T.CurrentRoleid, T.LocationId,
T.LastPurchaseYear, T.Url, T.VendorDescription, 
sum(OT1.AmountInGrams) as TotalWeightBoughtInGrams, 
T.AmountConsumedInGrams

FROM Tea T JOIN OrderTea OT1 ON OT1.TeaId=T.TeaId
JOIN (
  SELECT MAX(O.Date) as Date, OT.TeaId
  FROM OrderTea OT JOIN "order" O ON OT.OrderId=O.OrderId
  GROUP BY OT.TeaId
) as LastOrders ON LastOrders.TeaId=T.TeaId
JOIN OrderTea OT2 ON LastOrders.TeaId = OT2.TeaId
JOIN "order" O2 ON OT2.OrderId=O2.OrderId AND O2.Date=LastOrders.Date
WHERE T.TeaId=$1
GROUP BY T.TeaId, OT2.Amountingrams
`;

const getTeaById = (req, res) =>
  db
    .query(SQL_QUERY_GET_TEA_BY_ID_FOR_LAST_ORDER, [req.params["teaId"]])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const SQL_QUERY_GET_TEA_LIST_START = `
SELECT T.TeaId, T.Name, 
S.Name as ShopName, TY.Name as TypeName, ST.Name as SubTypeName, 
C.Name as CountryName, A.Name as AreaName, F.Name as FormatName, 
T.WeightInGrams, T.LastPurchasePriceInUsdCents, 
ROUND((CAST(T.LastPurchasePriceInUsdCents AS DECIMAL) / 
       CAST(T.WeightInGrams AS DECIMAL)), 0) as PricePerGram,
T.Comments, T.IsSample, T.Received, T.Gone, T.OutOfStock, 
R.Name as CurrentRoleName, L.Name as LocationName, 
T.LastPurchaseYear, T.Url, T.VendorDescription, 
SUM(OT.AmountInGrams) as TotalWeightBoughtInGrams,
T.AmountConsumedInGrams

FROM Tea T 
JOIN OrderTea OT ON OT.TeaId=T.TeaId
JOIN Shop S ON T.ShopId=S.ShopId 
JOIN Type TY ON T.TypeId=TY.TypeId
LEFT JOIN SubType ST ON T.SubTypeId=ST.SubTypeId 
JOIN Country C ON T.CountryId=C.CountryId
LEFT JOIN Area A ON T.AreaId=A.AreaId
JOIN Format F ON T.FormatId=F.FormatId
JOIN Location L ON T.LocationId = L.LocationId
JOIN CurrentRole R ON T.CurrentRoleId=R.CurrentRoleId
`;
const SQL_QUERY_GET_TEA_LIST_END = `
GROUP BY T.TeaId, S.Name, TY.Name, ST.Name, C.Name, A.Name, F.Name, L.Name, 
R.Name
ORDER BY T.TeaId DESC
`;

const whereClause = queryParams => {
  console.log(queryParams);
  var whereClause = "";
  let parameters = [];
  let i = 0;

  const {
    pricebt,
    pricest,
    grampricebt,
    grampricest,
    ...simpleFilters
  } = queryParams;

  for (let [key, value] of Object.entries(simpleFilters)) {
    whereClause = whereClause + " AND T." + key + " = $" + ++i;
    parameters.push(value);
    console.log(`${i}: ${value}  (${key})`);
  }

  if (pricebt) {
    whereClause =
      whereClause +
      " AND CAST(T.LastPurchasePriceInUsdCents AS Decimal) / 100 >= $" +
      ++i;

    parameters.push(pricebt);
  }
  if (pricest) {
    whereClause =
      whereClause +
      " AND CAST(T.LastPurchasePriceInUsdCents AS Decimal) / 100 <= $" +
      ++i;
    parameters.push(pricest);
  }
  if (grampricebt) {
    whereClause =
      whereClause +
      ` AND CAST(T.LastPurchasePriceInUsdCents AS Decimal) / 
        ( CAST(T.WeightInGrams AS Decimal) * 100 ) >= $` +
      ++i;
    parameters.push(grampricebt);
  }
  if (grampricest) {
    whereClause =
      whereClause +
      ` AND CAST(T.LastPurchasePriceInUsdCents AS Decimal) / 
        ( CAST(T.WeightInGrams AS Decimal) * 100 ) <= $` +
      ++i;
    parameters.push(grampricest);
  }

  if (whereClause.length > 4) {
    whereClause = "WHERE" + whereClause.slice(4);
  }

  return { whereClause: whereClause, parameters: parameters };
};

const getTeasWithFilters = (req, res) => {
  const whereObject = whereClause(req.query);
  let query =
    SQL_QUERY_GET_TEA_LIST_START +
    whereObject.whereClause +
    SQL_QUERY_GET_TEA_LIST_END;

  return db
    .query(query, whereObject.parameters)
    .then(result =>
      result.rows.map(row => fields.displayFields.map(createComponents(row)))
    )
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const SQL_QUERY_GET_TEAS_BY_ORDERID = `
SELECT T.TeaId, T.Name
FROM Tea T 
JOIN OrderTea OT ON OT.TeaId=T.TeaId and OT.OrderId=$1
`;

const getTeasByOrderId = queries.queryRoute(SQL_QUERY_GET_TEAS_BY_ORDERID, [
  "orderId"
]);

const getTeaFields = (req, res) => res.status(200).send(fields.formFields);

const getTeaFilters = (req, res) => res.status(200).send(filters.formFields);

const teaFields = [
  "shopid",
  "typeid",
  "subtypeid",
  "countryid",
  "areaid",
  "formatid",
  "locationid",
  "currentroleid",
  "name",
  "issample",
  "weightingrams",
  "lastpurchaseyear",
  "lastpurchasepriceinusdcents",
  "received",
  "gone",
  "outofstock",
  "url",
  "vendordescription",
  "amountconsumedingrams",
  "comments"
];

const orderTeaFields = ["amountingrams"];

const SQL_QUERY_CREATE_TEA = `
INSERT INTO Tea
VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
  $15, $16, $17, $18, $19, $20, to_timestamp($21 / 1000.0), $22)
ON CONFLICT (ShopId, Name)
DO NOTHING
RETURNING TeaId
`;

const SQL_QUERY_CREATE_ORDERTEA = `
INSERT INTO OrderTea
VALUES(default, $1, $2, $3)
ON CONFLICT (OrderId, TeaId, AmountInGrams)
DO NOTHING
RETURNING TeaId, OrderTeaId
`;

const insertTea = (poolClient, orderId, teaBodyFields, orderTeaBodyFields) =>
  db
    .queryWithClient(poolClient, "BEGIN", [])
    .then(() =>
      db.queryWithClient(poolClient, SQL_QUERY_CREATE_TEA, teaBodyFields)
    )
    .catch(e => {
      console.log(e);
      db.queryWithClient(poolClient, "ROLLBACK", []);
      return e;
    })
    .then(queryResult => {
      const { rows } = queryResult;
      if (rows.length === 0) {
        throw "Error: Tea not created";
      }
      const orderTeaParameters = [
        orderId,
        rows[0].teaid,
        ...orderTeaBodyFields
      ];
      if (orderTeaParameters.some(value => value === undefined) === true) {
        throw "Error: Tea cannot be created in database, missing parameters";
      }
      return db.queryWithClient(
        poolClient,
        SQL_QUERY_CREATE_ORDERTEA,
        orderTeaParameters
      );
    })
    .then(queryResult => {
      if (queryResult.rows.length > 0 && queryResult.rows[0].orderteaid) {
        db.queryWithClient(poolClient, "COMMIT", []);
        return queryResult.rows;
      } else {
        throw "Error: Tea was not created in database";
      }
    })
    .catch(e => {
      db.queryWithClient(poolClient, "ROLLBACK", []);
      return e;
    })
    .finally(poolClient.release());

const createTea = (req, res) => {
  const orderId = req.params["orderId"];
  const teaFieldValues = teaFields.map(key => req.body[0][key]);
  const teaBodyFields = [
    ...teaFieldValues,
    Date.now(),
    req.body[0]["lastupdateuserid"]
  ];
  const orderTeaBodyFields = orderTeaFields.map(key => req.body[0][key]);
  return db
    .getClient(insertTea, orderId, teaBodyFields, orderTeaBodyFields)
    .then(rows => res.status(200).send(rows))
    .catch(e => res.status(500).send(e));
};

module.exports = {
  getTeaFields: getTeaFields,
  getTeaFilters: getTeaFilters,
  getTeasWithFilters: getTeasWithFilters,
  getTeasByOrderId: getTeasByOrderId,
  getTeaByTeaIdAndOrderId: getTeaByTeaIdAndOrderId,
  getTeaById: getTeaById,
  createTea: createTea
};
