"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_AREAS = `
SELECT DISTINCT A.AreaId, A.Name, C.CountryId, C.Name as CountryName, 
T.TeaId is null as CanDelete 

FROM Area A join Country C on A.CountryId=C.CountryId 
left join Tea T on A.AreaId=T.AreaId
`;
const getAllAreas = queries.getQueryNoParams(SQL_QUERY_MANAGE_AREAS);

module.exports = {
  getAllAreasWithCountryName: getAllAreas
};
