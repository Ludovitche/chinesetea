"use strict";

const db = require("../db");
const fields = require("../clientFieldList/teaFields");
const filters = require("../clientFieldList/teaFilterFields");
const { createComponents } = require("../clientFieldList/utils");

const SQL_QUERY_GET_TEA = `
SELECT * from Tea
WHERE TeaId=$1`;

const getTeaById = (req, res) =>
  db
    .query(SQL_QUERY_GET_TEA, [req.params["teaId"]])
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const SQL_QUERY_GET_TEA_LIST = `
SELECT S.Name as ShopName, TY.Name as TypeName, ST.Name as SubTypeName,
C.Name as CountryName, A.Name as AreaName, F.Name as FormatName, T.issample,
T.weightingrams, T.lastpurchaseyear, T.lastpurchasepriceinusdcents,
T.received, T.gone, T.outofstock, T.url, T.vendordescription, 
T.amountconsumedingrams, T.comments

FROM Tea T join Shop S on T.ShopId=S.ShopId 
join Type TY on T.TypeId=TY.TypeId
left join SubType ST on T.SubTypeId=ST.SubTypeId 
join Country C on T.CountryId=C.CountryId
left join Area A on T.AreaId=A.AreaId
join Format F on T.FormatId=F.FormatId
join Location L on T.LocationId = L.LocationId
join CurrentRole R on T.CurrentRoleId=R.CurrentRoleId`;

const getTeasWithFilters = (req, res) =>
  db
    .simpleQuery(SQL_QUERY_GET_TEA_LIST)
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const getTeaFields = (req, res) => res.status(200).send(fields.formFields);

const getTeaFilters = (req, res) => res.status(200).send(filters.formFields);

module.exports = {
  getTeaFields: getTeaFields,
  getTeaById: getTeaById,
  getTeasWithFilters: getTeasWithFilters,
  getTeaFilters: getTeaFilters
};
