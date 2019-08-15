"use strict";

const db = require("./db");

const queryRoute = (query, paramKeyList) => (req, res) => {
  db.query(query, paramKeyList.map(key => req.params[key]))
    .then(data => res.status(200).send(data.rows))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const updateQueryRoute = (query, paramKeyList, body, bodyFieldsList) => (
  req,
  res
) => {
  let params = paramKeyList.map(key => req.params[key]);
  db.query(query, paramKeyList.map(key => req.params[key]))
    .then(data => res.status(200).send(data.rows))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

module.exports = {
  queryRoute: queryRoute,
  updateQueryRoute: updateQueryRoute
};
