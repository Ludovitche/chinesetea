"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_TYPES = `
SELECT DISTINCT TY.*, (T.TeaId is null and ST.SubTypeId is null) as CanDelete

FROM Type TY left join Tea T on TY.TypeId=T.TypeId 
left join SubType ST on ST.TypeId=T.TypeId`;

const getAllTypes = queries.queryRoute(SQL_QUERY_MANAGE_TYPES, []);

module.exports = {
  getAllTypes: getAllTypes
};
