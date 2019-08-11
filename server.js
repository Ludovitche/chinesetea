"use strict";

const express = require("express");
const app = express();

const { getAllTeaDropdownLists } = require("./routes/teaproperties");
const { getAllCountries } = require("./routes/country");
const { getAllAreasWithCountryName } = require("./routes/area");
const { getAllTypes } = require("./routes/type");
const { getAllSubTypesWithTypeName } = require("./routes/subtype");
const { getAllShops } = require("./routes/shop");

const {
  getAllOrdersAndTeas,
  getOrderById,
  getOrderFields
} = require("./routes/order");
const {
  getTeasWithFilters,
  getTeaById,
  getTeaFields
} = require("./routes/tea");

// when creating a new 'order' or 'tea' resource, the client will create form
// fields dynamically, using the list of fields returned by below requests
// I didn't find a 'best practice' uri format for this
app.get("/orders/describe", getOrderFields);
app.get("/teas/describe", getTeaFields);

// the rest however is a 'normal' REST API (but no hateoas)
app.get("/orders", getAllOrdersAndTeas);
app.get("/orders/:orderId", getOrderById);
app.get("/orders", getAllOrdersAndTeas);
app.get("/orders/:orderId", getOrderById);

// we get the data for all dropdown list in 1 request (it will remain small)
app.get("/teas/options", getAllTeaDropdownLists);

// These resources are the tea options that can be modified (not all)
// These requests, including the GET, are meant to be accessed only in settings
// Each result of get query contains a calculated field indicating if the
// resource can be deleted or not
app.get("/countries", getAllCountries);
app.get("/areas", getAllAreasWithCountryName);
app.get("/types", getAllTypes);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.get("/shops", getAllShops);

// This needs to be last (default routing)
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + " not found"
  });
});

// Port 5000 is the default Dokku application port
app.listen(5000, () => console.log("Listening on port 5000"));
