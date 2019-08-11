"use strict";

const db = require("../db");

const SQL_QUERY_GET_SHOPS = `SELECT ShopId, Name FROM Shop`;
const SQL_QUERY_GET_TYPES = `SELECT TypeId, Name FROM Type`;
const SQL_QUERY_GET_SUBTYPES = `SELECT SubTypeId, Name, TypeId FROM SubType`;
const SQL_QUERY_GET_COUNTRIES = `SELECT CountryId, Name FROM Country`;
const SQL_QUERY_GET_AREAS = `SELECT AreaId, Name, CountryId FROM Areas`;
const SQL_QUERY_GET_FORMATS = `SELECT FormatId, Name FROM Format`;
const SQL_QUERY_GET_LOCATIONS = `SELECT LocationId, Name FROM Location`;
const SQL_QUERY_GET_ROLES = `SELECT CurrentRoleId, Name FROM CurrentRole`;

const getAllTeaDropdownLists = (req, res) => {
  return Promise.all([
    db.simpleQuery(SQL_QUERY_GET_SHOPS).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_TYPES).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_SUBTYPES).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_COUNTRIES).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_AREAS).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_FORMATS).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_LOCATIONS).then(data => data.rows),
    db.simpleQuery(SQL_QUERY_GET_ROLES).then(data => data.rows)
  ])
    .then(([formats, roles, locations]) => ({
      shops,
      types,
      subtypes,
      countries,
      areas,
      formats,
      locations,
      roles
    }))
    .then(result => res.status(200).send(result))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

module.exports = {
  getAllTeaDropdownLists: getAllTeaDropdownLists
};
