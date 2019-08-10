"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_COUNTRIES = `
SELECT DISTINCT C.*, (T.TeaId is null and A.AreaId is null) as CanDelete

FROM Country C left join Tea T on C.CountryId=T.CountryId 
left join Area A on C.CountryId=A.CountryId
`;

const getAllCountries = queries.getQueryNoParams(SQL_QUERY_MANAGE_COUNTRIES);

module.exports = {
  getAllCountries: getAllCountries
};
