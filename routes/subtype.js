"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_SUBTYPES = `
SELECT DISTINCT S.SubTypeId, S.Name, TY.TypeId, TY.Name as TypeName, 
T.TeaId is null as CanDelete

FROM SubType S 
JOIN Type TY ON S.typeId=TY.TypeId 
LEFT JOIN Tea T ON S.SubTypeId=T.SubTypeId

ORDER BY TY.TypeId, S.SubTypeId
`;

const getAllSubTypes = queries.getQueryRoute(SQL_QUERY_MANAGE_SUBTYPES, []);

const SQL_QUERY_NEW_SUBTYPE = `
INSERT INTO SubType 
VALUES (default, $1, $2)
ON CONFLICT (typeid, name)
DO NOTHING
RETURNING SubTypeId
`;

const createSubType = queries.createQueryRoute(
  SQL_QUERY_NEW_SUBTYPE,
  ["typeid"],
  [{ key: "name", mandatory: 1 }]
);

const SQL_QUERY_MODIFY_SUBTYPE = `
UPDATE SubType
SET Name=$2
WHERE SubTypeId=$1
RETURNING SubTypeId
`;

const updateSubType = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_SUBTYPE,
  ["subtypeid"],
  [{ key: "name", mandatory: 1 }]
);

const SQL_QUERY_DELETE_SUBTYPE = `
DELETE FROM SubType
WHERE SubTypeId=$1
RETURNING SubTypeId
`;

const deleteSubType = queries.deleteQueryRoute(SQL_QUERY_DELETE_SUBTYPE, [
  "subtypeid"
]);

module.exports = {
  getAllSubTypesWithTypeName: getAllSubTypes,
  createSubType: createSubType,
  updateSubType: updateSubType,
  deleteSubType: deleteSubType
};
