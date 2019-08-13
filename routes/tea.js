"use strict";

const db = require("../db");
const fields = require("../clientFieldList/teaFields");
const filters = require("../clientFieldList/teaFilterFields");
const { createComponents } = require("../clientFieldList/utils");

// this query gets the weight of current Order (OT2) + the weight for all orders
// + the weight for all orders (OT1) in a single request (OVERKILL !)
const SQL_QUERY_GET_TEA_FOR_SPECIFIC_ORDER = `
SELECT sum(OT1.amountingrams) as totalweightboughtingrams, OT2.amountingrams, 
T.*

FROM Tea T JOIN OrderTea OT1 ON OT1.TeaId=T.TeaId
JOIN OrderTea OT2 ON OT2.TeaId=T.TeaId AND OT2.OrderId=$2

GROUP BY T.TeaId, OT2.amountingrams
HAVING T.TeaId=$1
`;

const getTeaByTeaIdAndOrderId = (req, res) =>
  db
    .query(SQL_QUERY_GET_TEA_FOR_SPECIFIC_ORDER, [
      req.params["teaId"],
      req.params["orderId"]
    ])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

// this query does the same than SQL_QUERY_GET_TEA_FOR_SPECIFIC_ORDER but
// instead of having the OrderId in input, it finds the most recent order,
// all in 1 request (OVERKILL ! next time I'll do simpler, just an exercise)
const SQL_QUERY_GET_TEA_FOR_LAST_ORDER = `
SELECT sum(OT1.amountingrams) as totalweightboughtingrams, OT2.amountingrams, 
T.*

FROM Tea T JOIN OrderTea OT1 ON OT1.TeaId=T.TeaId
JOIN (
  SELECT MAX(O.Date) as Date, OT.TeaId
  FROM OrderTea OT JOIN "order" O ON OT.OrderId=O.OrderId
  GROUP BY OT.TeaId
) as LastOrders ON LastOrders.TeaId=T.TeaId
JOIN OrderTea OT2 ON LastOrders.TeaId = OT2.TeaId
JOIN "order" O2 ON OT2.OrderId=O2.OrderId AND O2.Date=LastOrders.Date

GROUP BY T.TeaId, OT2.amountingrams
HAVING T.TeaId=$1
`;

const getTeaById = (req, res) =>
  db
    .query(SQL_QUERY_GET_TEA_FOR_LAST_ORDER, [req.params["teaId"]])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const SQL_QUERY_GET_TEA_LIST = `
SELECT T.TeaId, T.Name, S.Name as ShopName, TY.Name as TypeName, 
ST.Name as SubTypeName, C.Name as CountryName, A.Name as AreaName, 
F.Name as FormatName, L.Name as LocationName, R.Name as CurrentRoleName, T.*,
ROUND((CAST(T.lastpurchasepriceinusdcents AS DECIMAL) / 
       CAST(T.weightingrams AS DECIMAL)), 0) as pricePerGram

FROM Tea T join Shop S on T.ShopId=S.ShopId 
join Type TY on T.TypeId=TY.TypeId
left join SubType ST on T.SubTypeId=ST.SubTypeId 
join Country C on T.CountryId=C.CountryId
left join Area A on T.AreaId=A.AreaId
join Format F on T.FormatId=F.FormatId
join Location L on T.LocationId = L.LocationId
join CurrentRole R on T.CurrentRoleId=R.CurrentRoleId
`;

const getTeasWithFilters = (req, res) =>
  db
    .simpleQuery(SQL_QUERY_GET_TEA_LIST)
    .then(result => {
      result.map(row => fields.displayFields.map(createComponents(row)));
    })
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const getTeaFields = (req, res) => res.status(200).send(fields.formFields);

const getTeaFilters = (req, res) => res.status(200).send(filters.formFields);

module.exports = {
  getTeaFields: getTeaFields,
  getTeaByTeaIdAndOrderId: getTeaByTeaIdAndOrderId,
  getTeaById: getTeaById,
  getTeasWithFilters: getTeasWithFilters,
  getTeaFilters: getTeaFilters
};
