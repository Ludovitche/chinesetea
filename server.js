'use strict';

const express = require('express');
const app = express();

const { getAllCountries } = require('./Routes/country')
const { getAllAreasWithCountryName } = require('./Routes/area')
const { getAllTypes } = require('./Routes/type')
const { getAllSubTypesWithTypeName } = require('./Routes/subtype')
const { getAllShops } = require('./Routes/shop')
const { getAllCurrencies } = require('./Routes/currency')

const { getAllTeaDropdownLists } = require('./Routes/teaproperties')

const { getAllOrdersWithTeaList, getOrder } = require('./Routes/order')

app.get("/countries", getAllCountries);
app.get("/areas", getAllAreasWithCountryName);
app.get("/types", getAllTypes);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.get("/shops", getAllShops);
app.get("/currencies", getAllCurrencies);

app.get("/teas/properties", getAllTeaDropdownLists)

app.get("/Orders", getAllOrdersWithTeaList);
app.get("/Order/:orderId", getOrder);

// This needs to be last (default routing)
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
