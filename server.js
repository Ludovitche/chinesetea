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
const { getAllOrdersWithTeaList } = require('./Routes/Order')

app.get("/countries", getAllCountries);
app.get("/country/:countryId/areas", getAreaListByCountry);
app.get("/areas", getAllAreasWithCountryName);
app.get("/types", getAllTypes);
app.get("/type/:typeId/subTypes", getSubTypeListByType);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.get("/formats", getAllFormats);
app.get("/shops", getAllShops);
app.get("/currencies", getAllCurrencies);
app.get("/locations", getAllLocations);
app.get("/currentRoles", getAllCurrentRoles);
app.get("/Orders", getAllOrdersWithTeaList);


// This needs to be last
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
