"use strict";

/* I chose to use Postgres instead of a noSql solution because:
1. I already know SQL and I want to concentrate on learning Node and javascript
2. I know that this database will never have to scale, it's for personal use
3. I actually do want to transform data from sql query to json, to practice js*/

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const normalQuery = (text, params) => {
  return pool.query(text, params);
};
const loggedNormalQuery = (text, params) => {
  const start = Date.now();
  return pool
    .query(text, params)
    .then(res => {
      const duration = Date.now() - start;
      const escapedText = text.replace(/\n/g, " ");
      console.log("executed query", {
        escapedText,
        duration,
        rows: res.rowCount
      });
      return res;
    })
    .catch(e => {
      const escapedText = text.replace(/\n/g, " ");
      console.log("executed query" + escapedText + "\nError: " + e);
    });
};

const noParamsQuery = text => {
  return pool.query(text);
};
const loggedNoParamsQuery = text => {
  const start = Date.now();
  return pool
    .query(text)
    .then(res => {
      const duration = Date.now() - start;
      const escapedText = text.replace(/\n/g, " ");
      console.log("executed query", {
        escapedText,
        duration,
        rows: res.rowCount
      });
      return res;
    })
    .catch(e => {
      const escapedText = text.replace(/\n/g, " ");
      console.log("executed query" + escapedText + "\nError: " + e);
    });
};

//Switch logs on/off here
module.exports = {
  query: loggedNormalQuery,
  simpleQuery: loggedNoParamsQuery
};
