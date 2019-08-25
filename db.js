"use strict";

/* I chose to use Postgres instead of a noSql solution because:
1. I already know SQL and I want to concentrate on learning Node and javascript
2. I know that this database will never have to scale, it's for personal use
3. I actually do want to transform data from sql query to json, to practice js*/

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const normalQuery = (text, params) => pool.query(text, params);

const loggedNormalQuery = (text, params) => {
  const start = Date.now();
  return pool
    .query(text, params)
    .then(res => {
      const duration = Date.now() - start;
      const escapedText = text.replace(/\n/g, " ");
      console.log("executed query: ", {
        escapedText,
        duration,
        params,
        rows: res.rowCount
      });
      return res;
    })
    .catch(e => {
      const escapedText = text.replace(/\n/g, " ");
      console.log("query failed: " + escapedText + params + "\nError: " + e);
      throw e;
    });
};

const getClient = (callback, paramsArray) =>
  pool
    .connect()
    .then(client => callback(client, ...paramsArray))
    .catch(e => {
      console.log(e.stack);
      return e;
    });

const clientQuery = (client, text, params) => client.query(text, params);

const loggedClientQuery = (client, text, params) => {
  const start = Date.now();
  return client
    .query(text, params)
    .then(res => {
      const duration = Date.now() - start;
      const escapedText = text.replace(/\n/g, " ");
      console.log("executed query: ", {
        escapedText,
        duration,
        params,
        rows: res.rowCount
      });
      return res;
    })
    .catch(e => {
      const escapedText = text.replace(/\n/g, " ");
      console.log("query failed: " + escapedText + params + "\nError: " + e);
      return e;
    });
};

//Switch logs on/off here
module.exports = {
  query: loggedNormalQuery,
  getClient: getClient,
  clientQuery: loggedClientQuery
};
