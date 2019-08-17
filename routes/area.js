"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_AREAS = `
SELECT DISTINCT A.AreaId, A.Name, C.CountryId, C.Name as AreaName, 
T.TeaId is null as CanDelete 

FROM Area A JOIN Country C ON A.CountryId=C.CountryId 
LEFT JOIN Tea T ON A.AreaId=T.AreaId
`;
const getAllAreas = queries.queryRoute(SQL_QUERY_MANAGE_AREAS, []);

const SQL_QUERY_NEW_AREA = `
INSERT INTO Area 
VALUES (default, $1, $2)
ON CONFLICT (countryid, name)
DO NOTHING
RETURNING AreaId
`;

const createArea = queries.updateQueryRoute(
  SQL_QUERY_NEW_AREA,
  ["countryid"],
  ["name"]
);

const SQL_QUERY_MODIFY_AREA = `
UPDATE Area
SET Name=$2
WHERE AreaId=$1
RETURNING AreaId
`;

const updateArea = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_AREA,
  ["areaid"],
  ["name"]
);

const SQL_QUERY_DELETE_AREA = `
DELETE FROM Area
WHERE AreaId=$1
RETURNING AreaId
`;

const deleteArea = queries.queryRoute(SQL_QUERY_DELETE_AREA, ["areaid"]);

module.exports = {
  getAllAreasWithCountryName: getAllAreas,
  createArea: createArea,
  updateArea: updateArea,
  deleteArea: deleteArea
};
