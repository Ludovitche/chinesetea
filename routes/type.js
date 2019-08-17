"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_TYPES = `
SELECT DISTINCT TY.*, (T.TeaId is null and ST.SubTypeId is null) as CanDelete

FROM Type TY 
LEFT JOIN Tea T ON TY.TypeId=T.TypeId 
LEFT JOIN SubType ST ON ST.TypeId=T.TypeId

ORDER BY TypeId
`;

const getAllTypes = queries.queryRoute(SQL_QUERY_MANAGE_TYPES, []);

const SQL_QUERY_NEW_TYPE = `
INSERT INTO Type 
VALUES (default, $1)
ON CONFLICT (name)
DO NOTHING
RETURNING TypeId
`;

const createType = queries.updateQueryRoute(SQL_QUERY_NEW_TYPE, [], ["name"]);

const SQL_QUERY_MODIFY_TYPE = `
UPDATE Type
SET Name=$2
WHERE TypeId=$1
RETURNING TypeId
`;

const updateType = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_TYPE,
  ["typeid"],
  ["name"]
);

const SQL_QUERY_DELETE_TYPE = `
DELETE FROM Type
WHERE TypeId=$1
RETURNING TypeId
`;

const deleteType = queries.queryRoute(SQL_QUERY_DELETE_TYPE, ["typeid"]);

module.exports = {
  getAllTypes: getAllTypes,
  createType: createType,
  updateType: updateType,
  deleteType: deleteType
};
