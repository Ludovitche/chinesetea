"use strict";

const db = require("./db");

const getQuery = (query, paramKeyList) => (req, res) => {
  db.query(query, paramKeyList.map(key => req.params[key]))
    .then(data => res.status(200).send(data.rows))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const getQueryNoParams = query => (req, res) => {
  db.simpleQuery(query)
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

module.exports = {
  getQuery: getQuery,
  getQueryNoParams: getQueryNoParams
};
