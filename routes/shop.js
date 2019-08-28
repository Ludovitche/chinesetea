"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_SHOPS = `
SELECT DISTINCT S.*, T.TeaId is null as CanDelete
FROM Shop S 
LEFT JOIN Tea T ON S.ShopId=T.ShopId
ORDER BY ShopId
`;

const getAllShops = queries.getQueryRoute(SQL_QUERY_MANAGE_SHOPS, []);

const SQL_QUERY_NEW_SHOP = `
INSERT INTO Shop 
VALUES (default, $1, $2)
ON CONFLICT (name)
DO NOTHING
RETURNING ShopId
`;

const createShop = queries.createQueryRoute(
  SQL_QUERY_NEW_SHOP,
  [],
  [{ key: "name", mandatory: 1 }, { key: "url", mandatory: 0 }]
);

const SQL_QUERY_MODIFY_SHOP = `
UPDATE Shop
SET Name=$2, Url=$3
WHERE ShopId=$1
RETURNING ShopId
`;

const updateShop = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_SHOP,
  ["shopid"],
  ["name", "url"]
);

const SQL_QUERY_DELETE_SHOP = `
DELETE FROM Shop
WHERE ShopId=$1
RETURNING ShopId
`;

const deleteShop = queries.getQueryRoute(SQL_QUERY_DELETE_SHOP, ["shopid"]);

module.exports = {
  getAllShops: getAllShops,
  createShop: createShop,
  updateShop: updateShop,
  deleteShop: deleteShop
};
