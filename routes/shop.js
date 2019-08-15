"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_SHOPS = `
SELECT DISTINCT S.*, T.TeaId is null as CanDelete

FROM Shop S left join Tea T on S.ShopId=T.ShopId
`;

const getAllShops = queries.queryRoute(SQL_QUERY_MANAGE_SHOPS, []);

module.exports = {
  getAllShops: getAllShops
};
