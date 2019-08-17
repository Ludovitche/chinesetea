"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

// Main objects are Order and Tea - an Order is linked to 0 or many teas
// All the other ressources are tea properties
const {
  getOrderFields,
  getAllOrdersAndTeas,
  getOrderById
} = require("./routes/order");
const {
  getTeaFields,
  getTeaFilters,
  getTeasWithFilters,
  getTeasByOrderId,
  getTeaByTeaIdAndOrderId,
  getTeaById
} = require("./routes/tea");

const { getAllTeaDropdownLists } = require("./routes/options");

const {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry
} = require("./routes/country");
const {
  getAllAreasWithCountryName,
  createArea,
  updateArea,
  deleteArea
} = require("./routes/area");
const {
  getAllTypes,
  createType,
  updateType,
  deleteType
} = require("./routes/type");
const {
  getAllSubTypesWithTypeName,
  createSubType,
  updateSubType,
  deleteSubType
} = require("./routes/subtype");
const { getAllShops } = require("./routes/shop");

// we get all dropdown list for tea / order properties, in 1 only request
app.get("/teas/options", getAllTeaDropdownLists);

// when creating a new 'order' or 'tea' resource, the client will create form
// fields dynamically, using the list of fields returned by the requests below
app.get("/orders/fields", getOrderFields);
app.get("/teas/fields", getTeaFields);
app.get("/teas/filters/fields", getTeaFilters);

// these GET request are meant to display data in read-only mode,
// they get all data from all tables in 1 request
app.get("/orders", getAllOrdersAndTeas);
app.get("/teas", getTeasWithFilters);

// these GET request are meant to prefill form for editing existing order
app.get("/orders/:orderId", getOrderById);
app.get("/orders/:orderId/teas", getTeasByOrderId);

// these GET request are meant to prefill form for editing existing tea
// option1 access tea from order: we know what is the OrderTea
app.get("/orders/:orderId/teas/:teaId", getTeaByTeaIdAndOrderId);
// option2 access tea from tea search: we use the OrderTea for most recent Order
app.get("/teas/:teaId", getTeaById);

// The requests below should be used only in screen Settings
// Get queries return a calculated field allowing or not to delete the resource
app.get("/countries", getAllCountries);
app.put("/countries", createCountry);
app.put("/countries/:countryid", updateCountry);
app.delete("/countries/:countryid", deleteCountry);
app.get("/areas", getAllAreasWithCountryName);
app.put("/countries/:countryid/areas", createArea);
app.put("/areas/:areaid", updateArea);
app.delete("/areas/:areaid", deleteArea);
app.get("/types", getAllTypes);
app.put("/types", createType);
app.put("/types/:typeid", updateType);
app.delete("/types/:typeid", deleteType);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.put("/types/:countryid/subTypes", createArea);
app.put("/subTypes/:subtypeid", updateArea);
app.delete("/subTypes/:subtypeid", deleteArea);
app.get("/shops", getAllShops);

app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + " not found"
  });
});

app.listen(5000, () => console.log("Listening on port 5000"));
