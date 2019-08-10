"use strict";

const db = require("../db");

const SQL_QUERY_GET_FORMATS = `SELECT FormatId, Name FROM Format`;
const SQL_QUERY_GET_ROLES = `SELECT CurrentRoleId, Name FROM CurrentRole`;
const SQL_QUERY_GET_LOCATIONS = `SELECT LocationId, Name FROM Location`;

const getAllTeaDropdownLists = (req, res) => {
  return Promise.all([
    db.simpleQuery(SQL_QUERY_GET_FORMATS).then(data => {
      result["formats"] = data.rows;
      return true;
    }),
    db.simpleQuery(SQL_QUERY_GET_ROLES).then(data => {
      result["currentRoles"] = data.rows;
      return true;
    }),
    db.simpleQuery(SQL_QUERY_GET_LOCATIONS).then(data => {
      result["locations"] = data.rows;
      return true;
    })
  ])
    .then(([formats, currentRoles, locations]) => ({
      formats,
      currentRoles,
      locations
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
