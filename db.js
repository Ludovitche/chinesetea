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


//Switch logs on/off here
module.exports = {
  query: loggedNormalQuery, 
  simpleQuery: loggedNoParamsQuery,
}