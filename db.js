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


const queryWithFieldTypes = (text, params) => {
  return pool.query(text, params)
}

const loggedQueryWithFieldTypes = (text, params) => {
  const start = Date.now()
  return pool.query(text, params).then(res => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      return res;
    }
  )
}

const noParamsQueryWithFieldTypes = (text) => {
  return pool.query(text)
}

const loggedNoParamsQueryWithFieldTypes = (text) => {
  const start = Date.now()
  return pool.query(text).then((res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      return res;
    }
  )
}


module.exports = {
  query: loggedNormalQuery, //Switch logs on/off here
  simpleQuery: loggedNoParamsQuery, //Switch logs on/off here
}