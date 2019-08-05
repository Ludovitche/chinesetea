'use strict';

const express = require('express');
const app = express();

const { getAllCountries, getAllCountriesCheckFK } = require('./Routes/Country')
const { getAreaListByCountry, getAllAreasWithCountryNameCheckFK } = require('./Routes/Area')
const { getAllTypes, getAllTypesCheckFK } = require('./Routes/Type')
const { getSubTypeListByType, getAllSubTypesWithTypeNameCheckFK } = require('./Routes/SubType')
const { getAllShops, getAllShopsCheckFK } = require('./Routes/Shop')
const { getAllCurrencies, getAllCurrenciesCheckFK } = require('./Routes/Currency')
const { getAllFormats } = require('./Routes/Format')
const { getAllLocations } = require('./Routes/Location')
const { getAllCurrentRoles } = require('./Routes/CurrentRole')
const { getAllOrdersWithTeaList, getOrder } = require('./Routes/Order')

app.get("/countries", getAllCountries);
app.get("/countries?testFK=1", getAllCountriesCheckFK);

app.get("/country/:countryId/areas", getAreaListByCountry);
app.get("/areas?testFK=1", getAllAreasWithCountryNameCheckFK);

app.get("/types", getAllTypes);
app.get("/types?testFK=1", getAllTypesCheckFK);

app.get("/type/:typeId/subTypes", getSubTypeListByType);
app.get("/subTypes?testFK=1", getAllSubTypesWithTypeNameCheckFK);

app.get("/shops", getAllShops);
app.get("/shops?testFK=1", getAllShopsCheckFK);

app.get("/currencies", getAllCurrencies);
app.get("/currencies?testFK=1", getAllCurrenciesCheckFK);

app.get("/formats", getAllFormats);
app.get("/currentRoles", getAllCurrentRoles);
app.get("/locations", getAllLocations);

app.get("/Orders", getAllOrdersWithTeaList);
app.get("/Order/:orderId", getOrder);

// This needs to be last (default routing)
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log('Listening on port 5000'));
