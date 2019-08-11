"use strict";

const db = require("../db");
const fields = require("../clientFieldList/teaFields");
const filters = require("../clientFieldList/teaFilterFields");
const { createComponents } = require("../clientFieldList/utils");

const SQL_QUERY_GET_TEA = `
select * from Tea
where TeaId=$1`;

const getTeaById = (req, res) =>
  db
    .query(SQL_QUERY_GET_ORDER, req.params.teaId)
    .then(result => fields.formFields.map(createComponents(result.rows[0])))
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });

const getTeasWithFilters = pagination => (req, res) => {};

const getTeaFields = (req, res) => res.status(200).send(fields.formFields);

const getTeaFilters = (req, res) => res.status(200).send(filters.formFields);

module.exports = {
  getTeaFields: getTeaFields,
  getTeaById: getTeaById,
  getTeasWithFilters: getTeasWithFilters,
  getTeaFilters: getTeaFilters
};
