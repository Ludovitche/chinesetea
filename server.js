'use strict';

const express = require('express');
const app = express();

const { getAllCountries } = require('./Routes/Country')
const { getAllAreasWithCountryName, getAreaListByCountry } = require('./Routes/Area')
const { getAllTypes } = require('./Routes/Type')
const { getAllSubTypesWithTypeName, getSubTypeListByType } = require('./Routes/SubType')
const { getAllFormats } = require('./Routes/Format')
const { getAllShops } = require('./Routes/Shop')
const { getAllCurrencies } = require('./Routes/Currency')
const { getAllLocations } = require('./Routes/Location')
const { getAllCurrentRoles } = require('./Routes/CurrentRole')

app.get("/countries", getAllCountries);
app.get("/areas", getAllAreasWithCountryName);
app.get("/areas/:countryId", getAreaListByCountry);
app.get("/types", getAllTypes);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.get("/subTypes/:typeId", getSubTypeListByType);
app.get("/formats", getAllFormats);
app.get("/shops", getAllShops);
app.get("/currencies", getAllCurrencies);
app.get("/locations", getAllLocations);
app.get("/currentRoles", getAllCurrentRoles);


// This needs to be last
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
