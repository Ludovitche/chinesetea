'use strict';

const express = require('express');
const app = express();

const {getCurrentRoleListWithId} = require('./Routes/ReadOnly/DropdownLists');

app.get("/currentRoles", getCurrentRoleListWithId);

// This needs to be last
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
