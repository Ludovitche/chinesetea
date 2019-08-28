"use strict";

const db = require("./db");

const getQueryRoute = (query, paramKeyList) => (req, res) => {
  db.query(query, paramKeyList.map(key => req.params[key]))
    .then(data => res.status(200).send(data.rows))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

const createQueryRoute = (query, paramKeyList, bodyFieldsList) => (
  req,
  res
) => {
  if (
    bodyFieldsList.some(
      item => item.mandatory && req.body[0][key] === undefined
    )
  ) {
    res.status(400).send({ Status: 400, Error: "Empty mandatory body field" });
  } else {
    const params = paramKeyList.map(key => req.params[key]);
    const bodyFields = bodyFieldsList.map(key => req.body[0][key]);
    const parameters = [...params, ...bodyFields];
    if (parameters.some(param => param === undefined)) {
      res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
    } else {
      db.query(query, parameters)
        .then(data => {
          if (data.rowCount > 0) {
            res.status(201).send(data.rows);
          } else {
            res
              .status(409)
              .send({ Status: 409, Error: "Unique constraint violation" });
          }
        })
        .catch(e => {
          console.log(e.stack);
          res.status(500).send(e);
        });
    }
  }
};

const updateQueryRoute = (query, paramKeyList, bodyFieldsList) => (
  req,
  res
) => {
  const params = paramKeyList.map(key => req.params[key]);
  const bodyFields = bodyFieldsList.map(key => req.body[0][key]);
  const parameters = [...params, ...bodyFields];
  db.query(query, parameters)
    .then(data => res.status(200).send(data.rows))
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e);
    });
};

module.exports = {
  getQueryRoute: getQueryRoute,
  createQueryRoute: createQueryRoute,
  updateQueryRoute: updateQueryRoute
};
