'use strict';

const express = require('express');
const app = express();

const { getAllCountries } = require('./routes/country');
const { getAllAreasWithCountryName } = require('./routes/area');
const { getAllTypes } = require('./routes/type');
const { getAllSubTypesWithTypeName } = require('./routes/subtype');
const { getAllShops } = require('./routes/shop');
const { getAllCurrencies } = require('./routes/currency');

const { getAllTeaDropdownLists } = require('./routes/teaproperties');

const { getAllOrdersWithTeaList, getOrder } = require('./routes/order');

app.get("/countries", getAllCountries);
app.get("/areas", getAllAreasWithCountryName);
app.get("/types", getAllTypes);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.get("/shops", getAllShops);
app.get("/currencies", getAllCurrencies);

app.get("/teas/properties", getAllTeaDropdownLists)

app.get("/orders", getAllOrdersWithTeaList);
app.get("/order/:orderId", getOrder);

// This needs to be last (default routing)
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
