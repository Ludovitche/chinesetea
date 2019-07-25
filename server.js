'use strict';

const express = require('express');
const app = express();
const {Pool} = require("pg");
const {getAllCurrentRole} = require('./Routes/ReadOnly/CurrentRole');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})  

app.get("/currentRoles", getAllCurrentRole(pool));

app.get("/", function(req, res, next) {
  pool.connect(function(err, client, done) {
      if (err) {
          console.log("ERROR connection failed: " + err);
          return res.status(400).send(err);
      }
      client.query("SELECT * FROM format", function(err, result) {
          done();
          if (err) {
              console.log(err);
              return res.status(400).send(err);
          }
          return res.status(200).send(result.rows);
      });
      client.addListener
  });
});

// This needs to be last
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
