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

// Main objects are Order and Tea, linked by an OrderTea table
const {
  getAllOrdersAndTeas,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderFormFields,
  getOrderTeaFormFields,
  getOrderDisplayFields
} = require("./routes/order");

const {
  getTeasFiltered,
  getTeasByOrderId,
  getTeaByTeaIdAndOrderId,
  getTeaById,
  createTea,
  deleteTea,
  createOrderTea,
  deleteOrderTea,
  getTeaFormFields,
  getTeaDisplayFields,
  getTeaFiltersFormFields
} = require("./routes/tea");

// All the other ressources are tea properties
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
const {
  getAllShops,
  createShop,
  updateShop,
  deleteShop
} = require("./routes/shop");

// we get all dropdown list for tea / order properties, in 1 only request
app.get("/teas/options", getAllTeaDropdownLists);

// the client can create forms dynamically using the result of these requests
app.get("/orders/displayFields", getOrderDisplayFields);
app.get("/orders/formFields", getOrderFormFields);
app.get("/orders/teas/formFields", getOrderTeaFormFields);
app.get("/teas/displayfields", getTeaDisplayFields);
app.get("/teas/formfields", getTeaFormFields);
app.get("/teas/filters/formfields", getTeaFiltersFormFields);

// these GET request are meant to display data in read-only mode
// they get all data from all tables in 1 request
app.get("/orders", getAllOrdersAndTeas);
app.get("/teas", getTeasFiltered);

// these request are meant to create/edit existing order
app.get("/orders/:orderId", getOrderById);
app.get("/orders/:orderId/teas", getTeasByOrderId);
app.post("/orders", createOrder);
app.put("/orders/:orderId", updateOrder);

// order a tea for the first time
app.post("/orders/:orderId/teas", createTea);
// reorder a tea
app.post("/orders/:orderId/teas/:teaId", createOrderTea);

// this request deletes an Order
// also deletes Teas that are linked only to this order
app.delete("/orders/:orderId", deleteOrder);
// this request deletes an OrderTea
// also deletes the tea if it is linked only to this order
app.delete("/orders/:orderId/teas/:teaId", deleteOrderTea);
// this request delete a Tea and all OrderTea linked to it
app.delete("/teas/:teaId", deleteTea);

// these request are meant to fetch data before editing an existing tea:
// option1, access tea from order: we know what is the OrderTea
app.get("/orders/:orderId/teas/:teaId", getTeaByTeaIdAndOrderId);
// option2, access tea from tea search: use the OrderTea from most recent Order
app.get("/teas/:teaId", getTeaById);

// The requests below should be used only in screen Settings
// Get queries return a calculated field allowing or not to delete the resource
app.get("/countries", getAllCountries);
app.post("/countries", createCountry);
app.put("/countries/:countryid", updateCountry);
app.delete("/countries/:countryid", deleteCountry);
app.get("/areas", getAllAreasWithCountryName);
app.post("/countries/:countryid/areas", createArea);
app.put("/areas/:areaid", updateArea);
app.delete("/areas/:areaid", deleteArea);
app.get("/types", getAllTypes);
app.post("/types", createType);
app.put("/types/:typeid", updateType);
app.delete("/types/:typeid", deleteType);
app.get("/subTypes", getAllSubTypesWithTypeName);
app.post("/types/:typeid/subTypes", createSubType);
app.put("/subTypes/:subtypeid", updateSubType);
app.delete("/subTypes/:subtypeid", deleteSubType);
app.get("/shops", getAllShops);
app.post("/shops", createShop);
app.put("/shops/:shopid", updateShop);
app.delete("/shops/:shopid", deleteShop);

app.use(function(req, res) {
  res.status(400).send({
    Status: 400,
    Error: "url" + req.originalUrl + " not found"
  });
});

app.listen(5000, () => console.log("Listening on port 5000"));
