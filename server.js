"use strict";

const express = require("express");
const app = express();

// Main objects are Order and Tea - an Order is linked to 0 or many teas
// All the other ressources are tea properties

const {
  getAllOrdersAndTeas,
  getOrderById,
  getOrderFields
} = require("./routes/order");

const {
  getTeasWithFilters,
  getTeaByTeaIdAndOrderId,
  getTeaById,
  getTeaFilters,
  getTeaFields
} = require("./routes/tea");

const { getAllTeaDropdownLists } = require("./routes/options");

const { getAllCountries } = require("./routes/country");
const { getAllAreasWithCountryName } = require("./routes/area");
const { getAllTypes } = require("./routes/type");
const { getAllSubTypesWithTypeName } = require("./routes/subtype");
const { getAllShops } = require("./routes/shop");

// when creating a new 'order' or 'tea' resource, the client will create form
// fields dynamically, using the list of fields returned by the requests below
app.get("/orders/fields", getOrderFields);
app.get("/teas/fields", getTeaFields);
app.get("/teas/filters/fields", getTeaFilters);

// we can order the same tea in different Orders.
// we can get a Tea from an Order
app.get("/orders", getAllOrdersAndTeas);
app.get("/orders/:orderId", getOrderById);
app.get("/orders/:orderId/teas/:teaId", getTeaByTeaIdAndOrderId);

// or we can search a list of teas by applying filters to request below
app.get("/teas", getTeasWithFilters);
// and then select a tea : in this case we will use data from most recent order
app.get("/teas/:teaId", getTeaById);

// we get all dropdown list for tea / order properties, in 1 only request
app.get("/teas/options", getAllTeaDropdownLists);

// The requests below, including the GET, should be used only in screen Settings
// Get queries return a calculated field allowing or not to delete the resource
app.get("/countries", getAllCountries);
app.get("/areas", getAllAreasWithCountryName);
app.get("/types", getAllTypes);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.get("/shops", getAllShops);

app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + " not found"
  });
});

app.listen(5000, () => console.log("Listening on port 5000"));
