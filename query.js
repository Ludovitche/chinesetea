"use strict";

const db = require("./db");

// some parameters will be booleans so we can't use "truthy" test
const paramNullOrEmpty = (paramDefinition, paramValuesList) =>
  paramDefinition.mandatory &&
  (paramValuesList[paramDefinition.key] === null ||
    paramValuesList[paramDefinition.key] === undefined ||
    paramValuesList[paramDefinition.key] === "");

const getQueryRoute = (query, paramKeyList) => (req, res) => {
  {
    const params = paramKeyList.map(key => req.params[key]);

    if (params.some(param => param === undefined)) {
      res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
    } else {
      db.query(query, params)
        .then(data => res.status(200).send(data.rows))
        .catch(e => {
          console.log(e.stack);
          res.status(500).send(e);
        });
    }
  }
};

// query parameters are always mandatory
const createQueryRoute = (query, paramKeyList, bodyFieldsList) => (
  req,
  res
) => {
  if (bodyFieldsList.some(param => paramNullOrEmpty(param, req.body[0]))) {
    res.status(422).send({ Status: 422, Error: "Empty mandatory body field" });
  } else {
    const params = paramKeyList.map(key => req.params[key]);
    const bodyFields = bodyFieldsList.map(item => req.body[0][item.key]);
    const parameters = [...params, ...bodyFields];

    if (params.some(param => param === undefined)) {
      res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
    } else {
      db.query(query, parameters)
        .then(data => {
          if (data.rowCount > 0) {
            res.status(201).send(data.rows);
          } else {
            //any other type of error should be handled in the catch
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
  if (bodyFieldsList.some(param => paramNullOrEmpty(param, req.body[0]))) {
    res.status(422).send({ Status: 422, Error: "Empty mandatory body field" });
  } else {
    const params = paramKeyList.map(key => req.params[key]);
    const bodyFields = bodyFieldsList.map(item => req.body[0][item.key]);
    const parameters = [...params, ...bodyFields];

    if (params.some(param => param === undefined)) {
      res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
    } else {
      db.query(query, parameters)
        .then(data => {
          if (data.rowCount > 0) {
            res.status(200).send(data.rows);
          } else {
            res
              .status(404)
              .send({ Status: 404, Error: "Resource not found, check Id" });
          }
        })
        .catch(e => {
          console.log(e.stack);
          res.status(500).send(e);
        });
    }
  }
};

const deleteQueryRoute = (query, paramKeyList) => (req, res) => {
  const parameters = paramKeyList.map(key => req.params[key]);

  if (parameters.some(param => param === undefined)) {
    res.status(400).send({ Status: 400, Error: "Missing URI parameter" });
  } else {
    db.query(query, parameters)
      .then(data => {
        if (data.rowCount > 0) {
          res.status(204).send();
        } else {
          res
            .status(404)
            .send({ Status: 404, Error: "Resource not found, check Id" });
        }
      })
      .catch(e => {
        console.log(e.stack);
        res.status(500).send(e);
      });
  }
};

module.exports = {
  getQueryRoute: getQueryRoute,
  createQueryRoute: createQueryRoute,
  updateQueryRoute: updateQueryRoute,
  deleteQueryRoute: deleteQueryRoute,
  paramNullOrEmpty: paramNullOrEmpty
};
