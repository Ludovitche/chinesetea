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
  getOrder,
  getOrderFields
} = require("./routes/order");

// when creating a new 'order' resource, the client will create form fields
// dynamically from the info returned by below request "schema"
// I didn't find a 'best practice' uri format for this
app.get("/orders/schema", getOrderFields);
// the rest however is a 'normal' REST API (no hateoas)
app.get("/orders", getAllOrdersAndTeas);
app.get("/orders/:orderId", getOrder);

// we get the data for all dropdown list in 1 request (it will remain small)
app.get("/teas/options", getAllTeaDropdownLists);

// these resources are meant to be accessed only in settings screen
// result contains a calculated field indicating if the resource can be deleted
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
