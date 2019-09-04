"use strict";

const queries = require("../query");

const SQL_QUERY_MANAGE_COUNTRIES = `
SELECT DISTINCT C.*, (T.TeaId is null and A.AreaId is null) as CanDelete
FROM Country C 
LEFT JOIN Tea T ON C.CountryId=T.CountryId 
LEFT JOIN Area A ON C.CountryId=A.CountryId

ORDER BY CountryId
`;

const getAllCountries = queries.getQueryRoute(SQL_QUERY_MANAGE_COUNTRIES, []);

const SQL_QUERY_NEW_COUNTRY = `
INSERT INTO Country 
VALUES (default, $1)
ON CONFLICT (name)
DO NOTHING
RETURNING CountryId
`;

const createCountry = queries.createQueryRoute(
  SQL_QUERY_NEW_COUNTRY,
  [],
  [{ key: "name", mandatory: 1 }]
);

const SQL_QUERY_MODIFY_COUNTRY = `
UPDATE Country
SET Name=$2
WHERE CountryId=$1
RETURNING CountryId
`;

const updateCountry = queries.updateQueryRoute(
  SQL_QUERY_MODIFY_COUNTRY,
  ["countryid"],
  [{ key: "name", mandatory: 1 }]
);

const SQL_QUERY_DELETE_COUNTRY = `
DELETE FROM Country
WHERE CountryId=$1
RETURNING CountryId
`;

const deleteCountry = queries.deleteQueryRoute(SQL_QUERY_DELETE_COUNTRY, [
  "countryid"
]);

module.exports = {
  getAllCountries: getAllCountries,
  createCountry: createCountry,
  updateCountry: updateCountry,
  deleteCountry: deleteCountry
};
