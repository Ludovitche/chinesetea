'use strict';

const db = require('./db')

const getQuery = (query, paramKeyList) => (req, res) => {
    db.query(query, paramKeyList.map(key => req.params[key]))
    .then(result => {
        count: result.rowCount
        data: result.rows
    })
  }
  
  const getQueryNoParams = (query) => (req, res) => {
    db.simpleQuery(query)
    .then(result => {
        count: result.rowCount
        data: result.rows
    })
  }
  
  module.exports = {
    getQuery: getQuery,
    getQueryNoParams: getQueryNoParams,
  }