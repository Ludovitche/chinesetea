"use strict";

const db = require("../db");

const SQL_QUERY_GET_SHOPS = `SELECT ShopId, Name FROM Shop 
                             ORDER BY Name`;
const SQL_QUERY_GET_TYPES = `SELECT TypeId, Name FROM Type 
                             ORDER BY Name`;
const SQL_QUERY_GET_SUBTYPES = `SELECT SubTypeId, Name, TypeId FROM SubType 
                                ORDER BY Name`;
const SQL_QUERY_GET_COUNTRIES = `SELECT CountryId, Name FROM Country 
                                 ORDER BY Name`;
const SQL_QUERY_GET_AREAS = `SELECT AreaId, Name, CountryId FROM Area 
                             ORDER BY Name`;
const SQL_QUERY_GET_FORMATS = `SELECT FormatId, Name FROM Format 
                               ORDER BY FormatId`;
const SQL_QUERY_GET_LOCATIONS = `SELECT LocationId, Name FROM Location 
                                 ORDER BY LocationId`;
const SQL_QUERY_GET_ROLES = `SELECT CurrentRoleId, Name FROM CurrentRole 
                             ORDER BY CurrentRoleId`;

const getAllTeaDropdownLists = (req, res) => {
  return Promise.all([
    db.query(SQL_QUERY_GET_SHOPS).then(data => data.rows),
    db.query(SQL_QUERY_GET_TYPES).then(data => data.rows),
    db.query(SQL_QUERY_GET_SUBTYPES).then(data => data.rows),
    db.query(SQL_QUERY_GET_COUNTRIES).then(data => data.rows),
    db.query(SQL_QUERY_GET_AREAS).then(data => data.rows),
    db.query(SQL_QUERY_GET_FORMATS).then(data => data.rows),
    db.query(SQL_QUERY_GET_LOCATIONS).then(data => data.rows),
    db.query(SQL_QUERY_GET_ROLES).then(data => data.rows)
  ])
    .then(
      // prettier-ignore
      ([shops, types, subtypes, countries, areas, formats, locations, roles]) => 
      ({shops, types, subtypes, countries, areas, formats, locations, roles})
    )
    .then(result => res.status(200).send(result))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

module.exports = {
  getAllTeaDropdownLists: getAllTeaDropdownLists
};
