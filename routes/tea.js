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
sum(OT1.AmountInGrams) as TotalWeightBoughtInGrams, 
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
       CAST(T.WeightInGrams AS DECIMAL)), 0) as PricePerGram
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
`;

const addWhereClause = queryParams => {
  console.log(queryParams);
  let whereClause = "";

  const {
    priceBiggerThan,
    priceSmallerThan,
    gramPriceBiggerThan,
    gramPriceSmallerThan,
    ...simpleFilters
  } = queryParams;

  for (const key in simpleFilters) {
    console.log(key, simpleFilters[key]);
  }
  console.log(priceBiggerThan);

  console.log(whereClause.length);
  if (whereClause.length > 4) {
    whereClause = "WHERE " + whereClause.slice(4);
  }
  console.log(whereClause);

  return whereClause;
};

const getTeasWithFilters = (req, res) => {
  let query = SQL_QUERY_GET_TEA_LIST_START + SQL_QUERY_GET_TEA_LIST_END;
  query = query + addWhereClause(req.query);
  query = query + SQL_QUERY_GET_TEA_LIST_END;
  db.simpleQuery(query)
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

const getTeasByOrderId = queries.getQuery(SQL_QUERY_GET_TEAS_BY_ORDERID, [
  "orderId"
]);

const getTeaFields = (req, res) => res.status(200).send(fields.formFields);

const getTeaFilters = (req, res) => res.status(200).send(filters.formFields);

module.exports = {
  getTeaFields: getTeaFields,
  getTeaFilters: getTeaFilters,
  getTeasWithFilters: getTeasWithFilters,
  getTeasByOrderId: getTeasByOrderId,
  getTeaByTeaIdAndOrderId: getTeaByTeaIdAndOrderId,
  getTeaById: getTeaById
};
