const express = require('express');
const app = express();
const {Pool} = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})  

app.get("/", function(req, res, next) {
  pool.connect(function(err, client, done) {
      if (err) {
          console.log("not able to get connection " + err);
          return res.status(400).send(err);
      }
      client.query("SELECT * FROM Users where id= $1", [1], function(err, result) {
          done();
          if (err) {
              console.log(err);
              return res.status(400).send(err);
          }
          return res.status(200).send(result.rows);
      });
  });
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
