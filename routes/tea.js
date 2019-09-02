"use strict";

const db = require("../db");
const queries = require("../query");
const fields = require("../clientFieldList/teaFields");
const filters = require("../clientFieldList/teaFilterFields");

// this query gets the weight of current Order (OT2) + the weight for all orders
// (OT1) in a single request (yes, a bit of an overkill - just practicing)
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

const getTeaByTeaIdAndOrderId = queries.getQueryRoute(
  SQL_QUERY_GET_TEA_BY_ID_FOR_SPECIFIC_ORDER,
  ["teaId", "orderId"]
);

// this query does the same than SQL_QUERY_GET_TEA_BY_ID_FOR_SPECIFIC_ORDER but
// instead of having the OrderId as an input, it finds the most recent order,
// all in 1 request (not really faster than separate requests ? to test)
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

const getTeaById = queries.getQueryRoute(
  SQL_QUERY_GET_TEA_BY_ID_FOR_LAST_ORDER,
  ["teaId"]
);

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

const getTeasFiltered = (req, res) => {
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

const getTeasByOrderId = queries.getQueryRoute(SQL_QUERY_GET_TEAS_BY_ORDERID, [
  "orderId"
]);

const getTeaFormFields = (req, res) => res.status(200).send(fields.formFields);
const getTeaDisplayFields = (req, res) =>
  res.status(200).send(fields.displayFields);

const getTeaFiltersFormFields = (req, res) =>
  res.status(200).send(filters.formFields);

const teaFields = [
  { key: "shopid", mandatory: 1 },
  { key: "typeid", mandatory: 1 },
  { key: "subtypeid", mandatory: 0 },
  { key: "countryid", mandatory: 1 },
  { key: "areaid", mandatory: 0 },
  { key: "formatid", mandatory: 1 },
  { key: "locationid", mandatory: 1 },
  { key: "currentroleid", mandatory: 1 },
  { key: "name", mandatory: 1 },
  { key: "issample", mandatory: 1 },
  { key: "weightingrams", mandatory: 1 },
  { key: "lastpurchaseyear", mandatory: 1 },
  { key: "lastpurchasepriceinusdcents", mandatory: 1 },
  { key: "received", mandatory: 1 },
  { key: "gone", mandatory: 1 },
  { key: "outofstock", mandatory: 1 },
  { key: "url", mandatory: 0 },
  { key: "vendordescription", mandatory: 0 },
  { key: "amountconsumedingrams", mandatory: 1 },
  { key: "comments", mandatory: 0 }
];

const orderTeaFields = [{ key: "amountingrams", mandatory: 1 }];

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
    .clientQuery(poolClient, "BEGIN", [])
    .then(() => db.clientQuery(poolClient, SQL_QUERY_CREATE_TEA, teaBodyFields))
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
      return db.clientQuery(
        poolClient,
        SQL_QUERY_CREATE_ORDERTEA,
        orderTeaParameters
      );
    })
    .then(queryResult => {
      if (queryResult.rows.length > 0 && queryResult.rows[0].orderteaid) {
        db.clientQuery(poolClient, "COMMIT", []);
        return queryResult;
      } else {
        return { rowCount: 0 };
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      throw e;
    })
    .finally(poolClient.release());

const createTea = (req, res) => {
  if (
    teaFields.some(
      param =>
        queries.paramNullOrEmpty(param, req.body[0]) ||
        orderTeaFields.some(param =>
          queries.paramNullOrEmpty(param, req.body[0])
        )
    )
  ) {
    res.status(422).send({ Status: 422, Error: "Empty mandatory body field" });
  } else if (!req.params["orderId"]) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    const orderId = req.params["orderId"];
    const teaFieldValues = teaFields.map(key => req.body[0][key]);
    const teaBodyFields = [
      ...teaFieldValues,
      Date.now(),
      req.body[0]["lastupdateuserid"]
    ];
    const orderTeaBodyFields = orderTeaFields.map(key => req.body[0][key]);

    return db
      .getClient(insertTea, [orderId, teaBodyFields, orderTeaBodyFields])
      .then(result => {
        if (result.rowCount > 0) {
          res.status(200).send(result.rows);
        } else {
          //any other type of error should be handled in the catch
          res
            .status(409)
            .send({ Status: 409, Error: "Unique constraint violation" });
        }
      })
      .catch(e => res.status(500).send(e));
  }
};

const SQL_QUERY_DELETE_TEA = `
DELETE FROM Tea
WHERE teaId=$1
RETURNING teaId
`;

const SQL_QUERY_DELETE_ORDERTEAS = `
DELETE FROM OrderTea
WHERE teaId=$1
RETURNING teaId
`;

const deleteTeaAndOrderTeas = (poolClient, teaId) =>
  db
    .clientQuery(poolClient, "BEGIN", [])
    .then(() => db.clientQuery(poolClient, SQL_QUERY_DELETE_ORDERTEAS, [teaId]))
    .then(queryResult => {
      if (queryResult.rows.length > 0 && queryResult.rows[0].teaid) {
        return db.clientQuery(poolClient, SQL_QUERY_DELETE_TEA, [teaId]);
      } else {
        throw "Error: OrderTeas not deleted";
      }
    })
    .then(queryResult => {
      if (queryResult.rows.length > 0 && queryResult.rows[0].teaid) {
        db.clientQuery(poolClient, "COMMIT", []);
        return queryResult.rows;
      } else {
        throw "Error: Tea not deleted";
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      throw e;
    })
    .finally(poolClient.release());

const deleteTea = (req, res) =>
  db
    .getClient(deleteTeaAndOrderTeas, [req.params["teaId"]])
    .then(result => res.status(200).send(result.rows))
    .catch(e => res.status(500).send(e));

//To use in case we reorder a tea
const createOrderTea = queries.updateQueryRoute(
  SQL_QUERY_CREATE_ORDERTEA,
  ["orderId", "teaId"],
  ["amountingrams"]
);

const SQL_QUERY_DELETE_ORDERTEA = `
DELETE FROM OrderTea
WHERE orderId=$1 and teaId=$2
RETURNING orderTeaId
`;

const SQL_QUERY_DELETE_ORPHAN_TEA = `
DELETE FROM Tea T1
USING Tea T2
LEFT JOIN OrderTea OT ON T2.TeaId=OT.TeaId
WHERE T1.TeaId=T2.TeaId and OT.OrderTeaId IS NULL
RETURNING T1.TeaId
`;

const deleteOrderTeaAndTea = (poolClient, OrderId, TeaId) =>
  db
    .clientQuery(poolClient, "BEGIN", [])
    .then(() =>
      db.clientQuery(poolClient, SQL_QUERY_DELETE_ORDERTEA, [OrderId, TeaId])
    )
    .then(orderTeaResult =>
      db
        .clientQuery(poolClient, SQL_QUERY_DELETE_ORPHAN_TEA, [])
        .then(teaResult => [orderTeaResult, teaResult])
    )
    .then(resultArray => {
      if (resultArray[0].rowCount > 0 && resultArray[0].rows[0].orderteaid) {
        return db
          .clientQuery(poolClient, "COMMIT", [])
          .then(() => [resultArray[0].rows[0], resultArray[1].rows])
          .catch(e => {
            throw e;
          });
      } else {
        return { rowCount: 0 };
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      console.log(e.stack);
      throw e;
    })
    .finally(poolClient.release());

const deleteOrderTea = (req, res) =>
  db
    .getClient(deleteOrderTeaAndTea, [
      req.params["orderId"],
      req.params["teaId"]
    ])
    .then(rows => {
      return res.status(200).send(rows);
    })
    .catch(e => res.status(500).send(e));

module.exports = {
  getTeasFiltered: getTeasFiltered,
  getTeasByOrderId: getTeasByOrderId,
  getTeaByTeaIdAndOrderId: getTeaByTeaIdAndOrderId,
  getTeaById: getTeaById,
  createTea: createTea,
  deleteTea: deleteTea,
  createOrderTea: createOrderTea,
  deleteOrderTea: deleteOrderTea,
  getTeaFormFields: getTeaFormFields,
  getTeaDisplayFields: getTeaDisplayFields,
  getTeaFiltersFormFields: getTeaFiltersFormFields
};
