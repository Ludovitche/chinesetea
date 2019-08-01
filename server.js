'use strict';

const express = require('express');
const app = express();

const dl = require('./Routes/ReadOnly/DropdownLists');

app.get("/countries", dl.getCountryListWithId);
app.get("/areas/:countryId", dl.getAreaListWithId);
app.get("/types", dl.getTypeListWithId);
app.get("/subTypes/:typeId", dl.getSubTypeListWithId);
app.get("/formats", dl.getFormatListWithId);
app.get("/shops", dl.getShopListWithId);
app.get("/currencies", dl.getCurrencyListWithId);
app.get("/locations", dl.getLocationListWithId);
app.get("/currentRoles", dl.getCurrentRoleListWithId);


// This needs to be last
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
