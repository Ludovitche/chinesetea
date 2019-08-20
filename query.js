"use strict";

const db = require("./db");

const queryRoute = (query, paramKeyList) => (req, res) => {
  console.log(req.params);
  db.query(query, paramKeyList.map(key => req.params[key]))
    .then(data => res.status(200).send(data.rows))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const updateQueryRoute = (query, paramKeyList, bodyFieldsList) => (
  req,
  res
) => {
  const params = paramKeyList.map(key => req.params[key]);
  const bodyFields = bodyFieldsList.map(key => req.body[0][key]);
  const parameters = [...params, ...bodyFields];
  console.log(parameters);
  db.query(query, parameters)
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
