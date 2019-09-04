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
sum(OT1.AmountInGrams) as TotalWeightBoughtInGrams, 
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
    if (filters.queryParamaters.includes(key)) {
      whereClause = whereClause + " AND T." + key + " = $" + ++i;
      parameters.push(value);
    } else {
      console.log("Wrong search parameter: " + key);
    }
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
    .then(result => res.status(200).send(result.rows))
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

const createTeaTransaction = (
  poolClient,
  orderId,
  teaBodyFields,
  orderTeaBodyFields
) =>
  db
    .clientQuery(poolClient, "BEGIN", [])
    .then(() => db.clientQuery(poolClient, SQL_QUERY_CREATE_TEA, teaBodyFields))
    .then(result => {
      if (result.rowCount === 0) {
        return result;
      } else {
        const { rows } = result;
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
      }
    })
    .then(result => {
      if (result.rowCount > 0 && result.rows[0].orderteaid) {
        db.clientQuery(poolClient, "COMMIT", []);
        return result;
      } else {
        db.clientQuery(poolClient, "ROLLBACK", []);
        return result;
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      throw e;
    })
    .finally(poolClient.release());

const createTea = (req, res) => {
  if (
    teaFields.some(param => queries.paramNullOrEmpty(param, req.body[0])) ||
    orderTeaFields.some(param => queries.paramNullOrEmpty(param, req.body[0]))
  ) {
    res.status(422).send({ Status: 422, Error: "Empty mandatory body field" });
  } else if (!req.params["orderId"]) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    const orderId = req.params["orderId"];
    const teaFieldValues = teaFields.map(field => req.body[0][field.key]);
    const teaBodyFields = [
      ...teaFieldValues,
      Date.now(),
      req.body[0]["lastupdateuserid"]
    ];
    const orderTeaBodyFields = orderTeaFields.map(
      field => req.body[0][field.key]
    );

    return db
      .getClient(createTeaTransaction, [
        orderId,
        teaBodyFields,
        orderTeaBodyFields
      ])
      .then(result => {
        if (result.rowCount > 0) {
          res.status(201).send(result.rows);
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

const SQL_QUERY_UPDATE_TEA = `
UPDATE Tea
SET shopid=$2, typeid=$3, subtypeid=$4, countryid=$5, areaid=$6, formatid$7, 
locationid=$8, currentroleid=$9, name=$10, issample=$11, weightingrams=$12, 
lastpurchaseyear=$13, lastpurchasepriceinusdcents=$14, received=$15, gone=$16, 
outofstock=$17, url=$18, vendordescription=$19, amountconsumedingrams=$20, 
comments$21, lastupdatedate=to_timestamp($22 / 1000.0), lastupdateuserid=$23
WHERE TeaId=$1
RETURNING TeaId
`;

const SQL_QUERY_UPDATE_ORDERTEA = `
UPDATE OrderTea
SET AmountInGrams=$3
WHERE OrderId=$1 AND TeaId=$2
RETURNING TeaId, OrderTeaId
`;

const updateTeaTransaction = (poolClient, teaParams, orderTeaParams) =>
  db
    .clientQuery(poolClient, "BEGIN", [])
    .then(() => db.clientQuery(poolClient, SQL_QUERY_UPDATE_TEA, teaParams))
    .then(result => {
      if (result.rowCount === 0) {
        return result;
      } else {
        return db.clientQuery(
          poolClient,
          SQL_QUERY_UPDATE_ORDERTEA,
          orderTeaParams
        );
      }
    })
    .then(result => {
      if (result.rowCount > 0 && result.rows[0].orderteaid) {
        db.clientQuery(poolClient, "COMMIT", []);
        return result;
      } else {
        db.clientQuery(poolClient, "ROLLBACK", []);
        return result;
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      throw e;
    })
    .finally(poolClient.release());

const updateTeaAndOrderTea = (req, res, orderId, teaId) => {
  const teaBodyFields = teaFields.map(field => req.body[0][field.key]);
  const teaParams = [
    teaId,
    ...teaBodyFields,
    Date.now(),
    req.body[0]["lastupdateuserid"]
  ];
  const orderTeaBodyFields = orderTeaFields.map(
    field => req.body[0][field.key]
  );
  const orderTeaParams = [orderId, teaId, ...orderTeaBodyFields];
  return db
    .getClient(updateTeaTransaction, [teaParams, orderTeaParams])
    .catch(e => e);
};

const updateTeaWithSpecificOrderTea = (req, res) => {
  if (
    teaFields.some(param => queries.paramNullOrEmpty(param, req.body[0])) ||
    orderTeaFields.some(param => queries.paramNullOrEmpty(param, req.body[0]))
  ) {
    res.status(422).send({ Status: 422, Error: "Empty mandatory body field" });
  } else if (!req.params["orderId"] || !req.params["teaId"]) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    return updateTeaAndOrderTea(
      req,
      res,
      req.params["orderId"],
      req.params["teaId"]
    )
      .then(result => {
        if (result.rowCount > 0) {
          res.status(201).send(result.rows);
        } else {
          res
            .status(404)
            .send({ Status: 404, Error: "Resource not found, check Id" });
        }
      })
      .catch(e => res.status(500).send(e));
  }
};

const SQL_QUERY_FIND_LAST_ORDER_FOR_TEA = `
SELECT OT2.orderid
FROM Tea T
JOIN (
  SELECT MAX(O.Date) as Date, OT.TeaId
  FROM OrderTea OT JOIN "order" O ON OT.OrderId=O.OrderId
  GROUP BY OT.TeaId
) as LastOrders ON LastOrders.TeaId=T.TeaId
JOIN OrderTea OT2 ON LastOrders.TeaId = OT2.TeaId
JOIN "order" O2 ON OT2.OrderId=O2.OrderId AND O2.Date=LastOrders.Date
WHERE T.TeaId=$1
`;

const updateTeaAndLastOrderTea = (req, res) => {
  if (
    teaFields.some(param => queries.paramNullOrEmpty(param, req.body[0])) ||
    orderTeaFields.some(param => queries.paramNullOrEmpty(param, req.body[0]))
  ) {
    res.status(422).send({ Status: 422, Error: "Empty mandatory body field" });
  } else if (!req.params["teaId"]) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    const teaId = req.params["teaId"];
    return queries
      .getQueryRoute(SQL_QUERY_FIND_LAST_ORDER_FOR_TEA, [teaId])
      .then(result => {
        if (result.rowCount > 0) {
          const orderId = result.rows[0].orderid;
          return updateTeaAndOrderTea(req, res, orderId, teaId);
        } else {
          return result;
        }
      })
      .then(result => {
        if (result.rowCount > 0) {
          res.status(201).send(result.rows);
        } else {
          res
            .status(404)
            .send({ Status: 404, Error: "Resource not found, check Id" });
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
RETURNING orderteaId
`;

const deleteTeaAndOrderTeas = (poolClient, teaId) =>
  db
    .clientQuery(poolClient, "BEGIN", [])
    .then(() => db.clientQuery(poolClient, SQL_QUERY_DELETE_ORDERTEAS, [teaId]))
    .then(result => {
      if (result.rowCount > 0 && result.rows[0].orderteaId) {
        return db.clientQuery(poolClient, SQL_QUERY_DELETE_TEA, [teaId]);
      } else {
        return result;
      }
    })
    .then(result => {
      if (result.rowCount > 0 && result.rows[0].teaid) {
        db.clientQuery(poolClient, "COMMIT", []);
        return result;
      } else {
        db.clientQuery(poolClient, "ROLLBACK", []);
        return result;
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      throw e;
    })
    .finally(poolClient.release());

const deleteTea = (req, res) => {
  if (!req.params["teaId"]) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    db.getClient(deleteTeaAndOrderTeas, [req.params["teaId"]])
      .then(result => {
        if (result.rowCount > 0) {
          res.status(204).send();
        } else {
          res
            .status(404)
            .send({ Status: 404, Error: "Resource not found, check Id" });
        }
      })
      .catch(e => res.status(500).send(e));
  }
};

//To use in case we reorder a tea
const createOrderTea = queries.createQueryRoute(
  SQL_QUERY_CREATE_ORDERTEA,
  ["orderId", "teaId"],
  [{ key: "amountingrams", mandatory: 1 }]
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
          .then(() => resultArray)
          .catch(e => {
            throw e;
          });
      } else {
        db.clientQuery(poolClient, "ROLLBACK", []);
        return resultArray;
      }
    })
    .catch(e => {
      db.clientQuery(poolClient, "ROLLBACK", []);
      console.log(e.stack);
      throw e;
    })
    .finally(poolClient.release());

const deleteOrderTea = (req, res) => {
  if (!req.params["orderId"] || !req.params["teaId"]) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    return db
      .getClient(deleteOrderTeaAndTea, [
        req.params["orderId"],
        req.params["teaId"]
      ])
      .then(resultArray => {
        if (resultArray[0].rowCount > 0) {
          res.status(204).send();
        } else {
          res
            .status(404)
            .send({ Status: 404, Error: "Resource not found, check Ids" });
        }
      })
      .catch(e => res.status(500).send(e));
  }
};

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
  getTeaFiltersFormFields: getTeaFiltersFormFields,
  updateTeaAndLastOrderTea: updateTeaAndLastOrderTea,
  updateTeaWithSpecificOrderTea: updateTeaWithSpecificOrderTea
};
