"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_SUBTYPES = `
SELECT DISTINCT S.SubTypeId, S.Name, TY.TypeId, TY.Name as TypeName, 
T.TeaId is null as CanDelete

FROM SubType S join Type TY on S.typeId=TY.TypeId 
left join Tea T on S.SubTypeId=T.SubTypeId
`;

const getAllSubTypes = queries.queryRoute(SQL_QUERY_MANAGE_SUBTYPES, []);

const SQL_QUERY_NEW_SUBTYPE = `
INSERT INTO SubType 
VALUES (default, $1, $2)
ON CONFLICT (typeid, name)
DO NOTHING
RETURNING SubTypeId
`;

const createSubType = queries.updateQueryRoute(
  SQL_QUERY_NEW_SUBTYPE,
  ["typeid"],
  ["name"]
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
  ["name"]
);

const SQL_QUERY_DELETE_SUBTYPE = `
DELETE FROM SubType
WHERE SubTypeId=$1
RETURNING SubTypeId
`;

const deleteSubType = queries.queryRoute(SQL_QUERY_DELETE_SUBTYPE, [
  "subtypeid"
]);

module.exports = {
  getAllSubTypesWithTypeName: getAllSubTypes,
  createSubType: createSubType,
  updateSubType: updateSubType,
  deleteSubType: deleteSubType
};
