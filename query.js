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

const updateQueryRoute = (query, paramKeyList, bodyFieldsList) => (
  req,
  res
) => {
  let params = paramKeyList.map(key => req.params[key]);
  console.log(req.body);
  let body = res.json({ requestBody: req.body });
  console.log(body);
  console.log(requestBody);
  let bodyFields = bodyFieldsList.map(key => body);
  console.log(bodyFields);
  db.query(query, { ...params, ...bodyFields })
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
