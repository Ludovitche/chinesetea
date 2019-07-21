const express = require('express');
const app = express();
const {Pool} = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})  

app.get('/', (req, res) => {
  res.send('Hello, Dokku!');
  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM format', function(err, result) {
      done();
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
      console.log(result.rows);
      res.status(200).send(result.rows);
    });
  });
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
