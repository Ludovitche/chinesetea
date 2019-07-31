'use strict';

const {Pool} = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
}) 

const normalQuery = (text, params) => {
  return pool.query(text, params)
}

const loggedNormalQuery = (text, params) => {
  const start = Date.now()
  return pool.query(text, params).then(res => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      return res;
    }
  )
}

const noParamsQuery = (text) => {
  return pool.query(text)
}

const loggedNoParamsQuery = (text) => {
  const start = Date.now()
  return pool.query(text).then((res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      return res;
    }
  )
}

const query = (query, params) => (req, res) => {
  //Switch logs on/off here
  loggedNormalQuery(query, params)
  //normalQuery(query, params)
  .then(data => res.status(200).send(data.rows))
	.catch(e => {
		console.log(e.stack)
		res.status(400).send(e);
	})
}

const simpleQuery = (query) => (req, res) => {
  //Switch logs on/off here
  loggedNoParamsQuery(query)
  //noParamsQuery(query)
  .then(data => res.status(200).send(data.rows))
	.catch(e => {
		console.log(e.stack)
		res.status(400).send(e);
	})
}

module.exports = {
  query: normalQuery,
  simpleQuery: noParamsQuery,
  rawDataQuery: query,
  rawDataSimpleQuery: simpleQuery,
}