"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_TYPES = `
SELECT DISTINCT TY.*, (T.TeaId is null and ST.SubTypeId is null) as CanDelete
FROM Type TY 
LEFT JOIN Tea T ON T.TypeId=TY.TypeId 
LEFT JOIN SubType ST ON ST.TypeId=TY.TypeId

ORDER BY TypeId
`;

const getAllTypes = queries.getQueryRoute(SQL_QUERY_MANAGE_TYPES, []);

const SQL_QUERY_NEW_TYPE = `
INSERT INTO Type 
VALUES (default, $1)
ON CONFLICT (name)
DO NOTHING
RETURNING TypeId
`;

const createType = queries.createQueryRoute(
  SQL_QUERY_NEW_TYPE,
  [],
  [{ key: "name", mandatory: 1 }]
);

const SQL_QUERY_MODIFY_TYPE = `
UPDATE Type
SET Name=$2
WHERE TypeId=$1
RETURNING TypeId
`;

const updateType = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_TYPE,
  ["typeid"],
  [{ key: "name", mandatory: 1 }]
);

const SQL_QUERY_DELETE_TYPE = `
DELETE FROM Type
WHERE TypeId=$1
RETURNING TypeId
`;

const deleteType = queries.deleteQueryRoute(SQL_QUERY_DELETE_TYPE, ["typeid"]);

module.exports = {
  getAllTypes: getAllTypes,
  createType: createType,
  updateType: updateType,
  deleteType: deleteType
};
