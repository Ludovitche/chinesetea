const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Dokku!');
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));

var pool = new pg.Pool()
pool.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM format', function(err, result) {
     if(err) return console.error(err);
     console.log(result.rows);
     done();
  });
});
